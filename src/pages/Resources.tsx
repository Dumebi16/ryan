import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import CTASection from "../components/CTASection";

export default function Resources() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      const { data: { session } } = await supabase.auth.getSession();
      const admin = !!session;
      setIsAdmin(admin);

      let query = supabase.from("posts").select("*");
      if (!admin) query = query.eq("is_published", true);
      query = query.order("published_at", { ascending: false });

      const { data, error } = await query;
      if (error) console.error("Error fetching posts:", error);
      else setPosts(data || []);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  const categories = useMemo(
    () => [...new Set(posts.map((p) => p.category).filter(Boolean))] as string[],
    [posts]
  );

  const displayPosts = useMemo(
    () => (activeCategory === "All" ? posts : posts.filter((p) => p.category === activeCategory)),
    [posts, activeCategory]
  );

  const featuredPost = displayPosts[0] ?? null;
  const gridPosts = displayPosts.slice(1);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white/90 selection:bg-[#D4AF37] selection:text-black font-light">

      {/* Archive Hero */}
      <div className="pt-32 md:pt-48 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-[1px] bg-[#D4AF37]" />
              <span className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase font-kiona font-bold">Insights</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-tight">
              Resources &<br className="hidden sm:block" /> Strategic Thinking
            </h1>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed">
              Market analysis, operational strategies, and tactical guides to help you navigate
              acquiring, growing, and exiting businesses.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-24">

        {/* Category Filter Bar */}
        {!loading && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-14">
            {["All", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 text-[10px] font-kiona uppercase tracking-widest transition-colors border ${
                  activeCategory === cat
                    ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                    : "border-white/10 text-white/50 hover:text-white hover:border-white/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64 border border-white/10 bg-white/[0.02]">
            <p className="text-white/50 tracking-widest font-kiona uppercase text-sm">Loading resources...</p>
          </div>
        ) : displayPosts.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 border border-white/10 bg-white/[0.02] gap-4">
            <p className="text-white/50 tracking-widest font-kiona uppercase text-sm">
              {posts.length === 0 ? "No articles published yet." : `No articles in ${activeCategory}.`}
            </p>
            <p className="text-white/30 text-sm">Check back soon for new insights.</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="group mb-14 border border-white/10 bg-white/[0.02] overflow-hidden hover:border-[#D4AF37]/40 transition-colors duration-500"
              >
                <Link
                  to={`/resources/${featuredPost.slug}${isAdmin && !featuredPost.is_published ? "?preview=true" : ""}`}
                  className="flex flex-col md:flex-row"
                  aria-label={`Read: ${featuredPost.title}`}
                >
                  {/* Image */}
                  <div className="md:w-1/2 aspect-video overflow-hidden bg-white/[0.03] shrink-0">
                    {featuredPost.cover_image_url ? (
                      <img
                        src={featuredPost.cover_image_url}
                        alt={featuredPost.hero_alt_text || featuredPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white/15 font-kiona text-xs uppercase tracking-widest">Featured</span>
                      </div>
                    )}
                  </div>
                  {/* Meta + Text */}
                  <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-5 flex-wrap">
                      {isAdmin && !featuredPost.is_published && (
                        <span className="text-[10px] border border-white/20 px-2 py-0.5 font-kiona uppercase tracking-wider text-white/50">
                          Draft
                        </span>
                      )}
                      {featuredPost.category && (
                        <span className="text-[#D4AF37] text-xs uppercase tracking-widest font-kiona font-bold">
                          {featuredPost.category}
                        </span>
                      )}
                      <span className="text-white/30 text-xs">
                        {new Date(featuredPost.published_at || featuredPost.created_at).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </span>
                      {featuredPost.read_time && (
                        <span className="text-white/30 text-xs">· {featuredPost.read_time} min read</span>
                      )}
                    </div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-5 tracking-tight text-white group-hover:text-[#D4AF37] transition-colors leading-tight">
                      {featuredPost.title}
                    </h2>
                    <p className="text-white/50 text-sm leading-relaxed mb-8 line-clamp-3">
                      {featuredPost.meta_description || featuredPost.excerpt || "Read more about this topic."}
                    </p>
                    <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-kiona font-bold text-[#D4AF37]">
                      Read Article
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Blog Grid */}
            {gridPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridPosts.map((post, idx) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.08 * idx }}
                    className="group border border-white/10 bg-white/[0.02] overflow-hidden flex flex-col hover:border-[#D4AF37]/40 transition-colors duration-500"
                  >
                    <Link
                      to={`/resources/${post.slug}${isAdmin && !post.is_published ? "?preview=true" : ""}`}
                      className="flex flex-col flex-grow"
                      aria-label={`Read: ${post.title}`}
                    >
                      {post.cover_image_url && (
                        <div className="h-48 overflow-hidden shrink-0">
                          <img
                            src={post.cover_image_url}
                            alt={post.hero_alt_text || post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                      )}
                      <div className="p-7 flex flex-col flex-grow">
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                          {isAdmin && !post.is_published && (
                            <span className="text-[10px] border border-white/20 px-2 py-0.5 font-kiona uppercase tracking-wider text-white/50">
                              Draft
                            </span>
                          )}
                          {post.category && (
                            <span className="text-[#D4AF37] text-xs uppercase tracking-widest font-kiona font-bold">
                              {post.category}
                            </span>
                          )}
                          <span className="text-white/30 text-xs">
                            {new Date(post.published_at || post.created_at).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric",
                            })}
                          </span>
                          {post.read_time && (
                            <span className="text-white/30 text-xs hidden sm:inline">· {post.read_time} min</span>
                          )}
                        </div>
                        <h2 className="text-xl font-light mb-4 text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
                          {post.title}
                        </h2>
                        <p className="text-white/50 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                          {post.meta_description || post.excerpt || "Read more about this topic."}
                        </p>
                        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-kiona font-bold text-white/60 group-hover:text-[#D4AF37] transition-colors mt-auto">
                          Read Article
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <CTASection heading="Need specific guidance?" />
    </div>
  );
}
