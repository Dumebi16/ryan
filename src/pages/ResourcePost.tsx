import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Helmet } from "react-helmet-async";
import { supabase } from "../lib/supabase";

export default function ResourcePost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;
      
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
      <div className="relative pt-32 md:pt-48 pb-16 px-6">
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

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12 prose prose-invert prose-lg prose-headings:font-light prose-a:text-[#D4AF37] prose-a:no-underline hover:prose-a:underline">
        <ReactMarkdown>{post.markdown_content || ""}</ReactMarkdown>
      </div>

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

      {/* CTA Section */}
      <div className="border-t border-white/10 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-5xl font-light mb-6 tracking-tight">Discuss Your Strategy</h2>
              <p className="text-white/60 text-lg leading-relaxed">
                Whether you're selling, buying, or just figuring out if this is even the right time — let's talk. No pressure, no pitch. Just a real conversation.
              </p>
            </div>
            <div className="flex flex-col items-start md:items-center gap-5 md:gap-8">
              <a
                href="https://ryankroge.com/contact/"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full md:w-auto inline-flex items-center justify-center gap-3 bg-[#D4AF37] text-black px-10 py-4 text-[11px] font-bold font-kiona tracking-widest uppercase transition-colors duration-300 hover:bg-white hover:text-black"
              >
                Apply
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
              </a>
              <p className="text-white/30 text-xs tracking-wide text-left md:text-center">
                No commitment required. Typical response within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
