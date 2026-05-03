import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Helmet } from "react-helmet-async";
import { supabase } from "../lib/supabase";
import { trackEvent, hasTracked, markTracked } from "../lib/analytics";
import CTASection from "../components/CTASection";

export default function ResourcePost() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";
  const [post, setPost] = useState<any>(null);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Parse H2/H3 headings from HTML content to build table of contents
  const tocItems = useMemo(() => {
    if (!post?.markdown_content?.trimStart().startsWith('<')) return [];
    const doc = new DOMParser().parseFromString(post.markdown_content, 'text/html');
    return [...doc.querySelectorAll('h2, h3')].map(h => {
      const text = h.textContent?.trim() ?? '';
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return { level: parseInt(h.tagName[1]), text, id };
    });
  }, [post?.markdown_content]);

  // Inject id attributes into headings so anchor links and scroll spy work
  const contentWithIds = useMemo(() => {
    if (!post?.markdown_content?.trimStart().startsWith('<')) return '';
    const doc = new DOMParser().parseFromString(post.markdown_content, 'text/html');
    doc.querySelectorAll('h2, h3').forEach(h => {
      const text = h.textContent?.trim() ?? '';
      h.id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    });
    return doc.body.innerHTML;
  }, [post?.markdown_content]);

  const [activeId, setActiveId] = useState('');

  // Scroll spy: highlight the TOC item for the section currently in view
  useEffect(() => {
    if (!tocItems.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0.1, 0.3] }
    );
    const t = setTimeout(() => {
      tocItems.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 200);
    return () => { clearTimeout(t); observer.disconnect(); };
  }, [tocItems]);

  // Track post_read when the reader reaches the sentinel div at ~75% of content
  useEffect(() => {
    if (!post || isPreview) return;
    const sentinel = document.getElementById("read-sentinel");
    if (!sentinel) return;
    const start = Date.now();
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasTracked(`read_${post.slug}`)) {
        markTracked(`read_${post.slug}`);
        const seconds = Math.round((Date.now() - start) / 1000);
        trackEvent("post_read", { id: post.id, slug: post.slug, category: post.category }, { time_on_page: seconds });
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [post, isPreview]);

  // When preview banner is visible, push the navbar down so both are fully visible
  useEffect(() => {
    if (!isPreview) return;
    const h = bannerRef.current?.offsetHeight ?? 34;
    const style = document.createElement('style');
    style.id = 'preview-banner-offset';
    style.textContent = `#navbar-root { top: ${h}px !important; }`;
    document.head.appendChild(style);
    return () => { document.getElementById('preview-banner-offset')?.remove(); };
  }, [isPreview]);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;

      // Preview mode: only authenticated admins can view drafts
      if (isPreview) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setPost(null);
          setLoading(false);
          return;
        }
      }

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .single();
        
      if (error) {
        console.error("Error fetching post:", error);
      } else {
        setPost(data);

        // Fetch FAQs if post exists
        if (data) {
          const { data: faqData } = await supabase
            .from("post_faqs")
            .select("*")
            .eq("post_id", data.id)
            .order("position", { ascending: true });

          setFaqs(faqData || []);

          // Track post_view once per session (skip in preview)
          if (!isPreview && !hasTracked(`view_${data.slug}`)) {
            markTracked(`view_${data.slug}`);
            trackEvent("post_view", { id: data.id, slug: data.slug, category: data.category });
          }
        }
      }
      setLoading(false);
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen text-white/90 pt-48 pb-24 font-light flex justify-center">
        <p className="text-white/50 tracking-widest font-kiona uppercase">Loading insight...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen text-white/90 pt-48 pb-24 font-light flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-tight">Post Not Found</h1>
        <Link to="/resources" className="text-[#D4AF37] tracking-widest font-kiona font-bold uppercase hover:text-white transition-colors">
          Return to Resources
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white/90 selection:bg-[#D4AF37] selection:text-black">
      {isPreview && (
        <div ref={bannerRef} className="fixed top-0 left-0 right-0 z-[60] bg-[#D4AF37] text-black text-center text-[10px] font-kiona uppercase tracking-widest py-2 flex items-center justify-center gap-6">
          <span>Preview Mode — This article is not publicly visible</span>
          <button onClick={() => window.close()} className="underline opacity-70 hover:opacity-100">Close Preview</button>
        </div>
      )}
      <Helmet>
        <title>{post.meta_title || post.title}</title>
        <meta name="description" content={post.meta_description || post.excerpt} />
        {post.canonical_url && <link rel="canonical" href={post.canonical_url} />}
        {post.noindex && <meta name="robots" content="noindex" />}
        <meta property="og:title" content={post.meta_title || post.title} />
        <meta property="og:description" content={post.meta_description || post.excerpt} />
        <meta name="twitter:title" content={post.twitter_title || post.meta_title || post.title} />
        <meta name="twitter:description" content={post.twitter_description || post.meta_description || post.excerpt} />
        {post.open_graph_image && <meta property="og:image" content={post.open_graph_image} />}
        
        {/* Article JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.meta_title || post.title,
            "author": { "@type": "Person", "name": post.author_name || "Ryan Kroge" },
            "datePublished": post.published_at || post.created_at,
            "image": post.cover_image_url || post.open_graph_image,
            "keywords": post.tags ? post.tags.join(", ") : undefined,
            "mainEntityOfPage": post.canonical_url || window.location.href,
            "about": post.key_entities ? post.key_entities.map((e: string) => ({ "@type": "Thing", "name": e })) : undefined
          })}
        </script>

        {/* FAQ JSON-LD */}
        {faqs.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            })}
          </script>
        )}

        {/* LocalBusiness JSON-LD */}
        {(post.local_business_name || (post.geos && post.geos.length > 0)) && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": post.local_business_name || "Ryan Kroge Consulting",
              "areaServed": post.service_area || undefined,
              "location": post.geos?.map((geo: any) => ({
                "@type": "Place",
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": geo.country,
                  "addressRegion": geo.region,
                  "addressLocality": geo.city
                }
              }))
            })}
          </script>
        )}
      </Helmet>

      {/* Hero Section */}
      <div className={`relative pb-16 px-6 ${isPreview ? 'pt-28 md:pt-36' : 'pt-32 md:pt-48'}`}>
        <div className="max-w-4xl mx-auto">
          <Link to="/resources" className="inline-flex items-center gap-2 text-white/50 hover:text-[#D4AF37] transition-colors tracking-widest font-kiona uppercase text-[10px] mb-12">
            <ArrowLeft className="w-3 h-3" /> Back to all insights
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            {post.category && (
              <span className="text-[#D4AF37] text-xs uppercase tracking-widest font-kiona font-bold">
                {post.category}
              </span>
            )}
            <span className="text-white/30 text-xs">
              {new Date(post.published_at || post.created_at).toLocaleDateString()}
            </span>
            {post.read_time && (
               <span className="text-white/30 text-xs whitespace-nowrap hidden sm:inline">
                 • {post.read_time} MIN READ
               </span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light mb-8 tracking-tight leading-tight">
            {post.title}
          </h1>
          
          <div className="w-full h-[1px] bg-white/10 my-8" />
          
          <div className="flex items-center gap-4">
            <div>
              <p className="text-white/80 font-medium">{post.author_name || "Ryan Kroge"}</p>
              <p className="text-white/40 text-sm">Strategic Advisor</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hero Image */}
      {post.cover_image_url && (
        <div className="max-w-5xl mx-auto px-6 mb-16">
          <div className="aspect-video w-full overflow-hidden">
            <img 
              src={post.cover_image_url} 
              alt={post.hero_alt_text || post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Content — two-column with TOC sidebar when headings exist, else centered */}
      {tocItems.length > 0 ? (
        <div className="max-w-[1100px] mx-auto px-6 py-12">
          {/* Mobile TOC — collapsible */}
          <details className="lg:hidden mb-10 border border-white/10 bg-white/[0.02] group/toc">
            <summary className="list-none flex items-center justify-between px-5 py-4 cursor-pointer select-none">
              <span className="text-[10px] font-kiona uppercase tracking-widest text-[#D4AF37]">On this page</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/40 transition-transform group-open/toc:rotate-180" />
            </summary>
            <nav className="px-5 pb-4 pt-3 space-y-2 border-t border-white/5">
              {tocItems.map(({ id, text, level }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="block text-sm text-white/60 hover:text-white transition-colors"
                  style={{ paddingLeft: level === 3 ? '14px' : '0' }}
                >
                  {text}
                </a>
              ))}
            </nav>
          </details>

          <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-16 lg:items-start">
            {/* Desktop sticky sidebar */}
            <aside className="hidden lg:block sticky top-32">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-6 h-[1px] bg-[#D4AF37]" />
                <span className="text-[10px] font-kiona uppercase tracking-widest text-[#D4AF37]">On this page</span>
              </div>
              <nav className="space-y-0.5">
                {tocItems.map(({ id, text, level }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className={`flex items-center py-1.5 text-[11px] leading-snug transition-colors border-l-2 ${
                      activeId === id
                        ? 'text-[#D4AF37] border-[#D4AF37] pl-3'
                        : 'text-white/35 hover:text-white/70 border-transparent pl-3'
                    } ${level === 3 ? 'ml-3' : ''}`}
                  >
                    {text}
                  </a>
                ))}
              </nav>
              <div className="mt-8">
                <Link
                  to="/contact"
                  onClick={() => post && trackEvent("cta_click", { id: post.id, slug: post.slug, category: post.category })}
                  className="inline-flex items-center gap-1.5 text-[10px] font-kiona uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors"
                >
                  Get in Touch <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </aside>

            {/* Article body */}
            <div className="prose prose-invert prose-lg prose-headings:font-light prose-a:text-[#D4AF37] prose-a:no-underline hover:prose-a:underline max-w-none">
              <div dangerouslySetInnerHTML={{ __html: contentWithIds }} />
              <div id="read-sentinel" />
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto px-6 py-12 prose prose-invert prose-lg prose-headings:font-light prose-a:text-[#D4AF37] prose-a:no-underline hover:prose-a:underline">
          {post.markdown_content?.trimStart().startsWith('<') ? (
            <div dangerouslySetInnerHTML={{ __html: post.markdown_content }} />
          ) : (
            <ReactMarkdown>{post.markdown_content || ""}</ReactMarkdown>
          )}
          <div id="read-sentinel" />
        </div>
      )}

      {/* Newsletter Embed */}
      <NewsletterEmbed slug={slug ?? ""} />

      {/* FAQs */}
      {faqs.length > 0 && (
        <div className="max-w-3xl mx-auto px-6 py-20 border-t border-white/10 mt-12">
           <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-[1px] bg-[#D4AF37]"></div>
            <span className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase font-kiona font-bold">FAQ</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-light mb-12 tracking-tight">Common Questions</h2>
          
          <div className="space-y-4">
            {faqs.map(({ id, question, answer }) => (
              <div 
                key={id} 
                className="border border-white/10 bg-white/[0.02] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === id ? null : id)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus-visible:bg-white/[0.05] transition-colors hover:bg-white/[0.04]"
                >
                  <span className="text-lg text-white font-medium">{question}</span>
                  <ChevronDown className={`w-5 h-5 text-white/50 transition-transform ${openFaq === id ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-0 text-white/60 leading-relaxed max-w-2xl border-t border-white/5 mt-2">
                        <div className="pt-4">{answer}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      )}

      <CTASection heading="Discuss Your Strategy" />
    </div>
  );
}

// ─── Newsletter Embed ─────────────────────────────────────────────────────────

function NewsletterEmbed({ slug }: { slug: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) return;
    setStatus("submitting");
    try {
      const { error } = await supabase.functions.invoke("subscribe-newsletter", {
        body: { email, post_slug: slug },
      });
      if (error) throw error;
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 border-t border-white/10 mt-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-[1px] bg-[#D4AF37]" />
        <span className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase font-kiona font-bold">Newsletter</span>
      </div>

      {status === "success" ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-[#D4AF37]/20 bg-[#D4AF37]/[0.04] p-6 flex items-start gap-5 max-w-md"
        >
          <div className="w-8 h-8 border border-[#D4AF37]/50 flex items-center justify-center shrink-0 mt-0.5">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7l3.5 3.5L12 3" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="text-white font-medium text-sm mb-1">You're on the list.</p>
            <p className="text-white/50 text-xs leading-relaxed">
              A welcome email is on its way. You'll receive Ryan's next insight on SBA loans and business acquisitions directly in your inbox.
            </p>
          </div>
        </motion.div>
      ) : (
        <>
          <h3 className="text-2xl md:text-3xl font-light tracking-tight mb-3">
            Get Ryan's Insights
          </h3>
          <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-md">
            SBA loans, business acquisitions, and strategic financial guidance — straight to your inbox. No noise. Unsubscribe anytime.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md">
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
              placeholder="your@email.com"
              required
              className={`flex-1 bg-white/[0.03] border text-white placeholder-white/25 px-4 py-3 text-sm font-sans outline-none transition-colors ${
                status === "error" ? "border-red-400/50 focus:border-red-400/70" : "border-white/10 focus:border-[#D4AF37]/40"
              }`}
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className="bg-[#D4AF37] text-black px-8 py-3 text-[11px] font-bold font-kiona tracking-widest uppercase transition-all duration-300 hover:bg-white hover:text-black disabled:opacity-60 disabled:pointer-events-none shrink-0"
            >
              {status === "submitting" ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Sending
                </span>
              ) : "Subscribe"}
            </button>
          </form>

          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 border border-red-400/20 bg-red-400/[0.04] px-4 py-3 flex items-center justify-between max-w-md"
            >
              <p className="text-red-400 text-xs font-sans">
                Something went wrong — please try again.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="text-red-400/60 hover:text-red-400 text-[10px] font-kiona uppercase tracking-widest ml-4 shrink-0 transition-colors"
              >
                Retry
              </button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
