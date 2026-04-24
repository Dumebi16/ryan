import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Resources() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      // Fetch published posts
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white/90 selection:bg-[#D4AF37] selection:text-black pt-32 pb-24 font-light">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-[1px] bg-[#D4AF37]"></div>
            <span className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase font-kiona font-bold">Insights</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-tight">
            Resources & <br className="hidden sm:block" /> Strategic Thinking
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed">
            Market analysis, operational strategies, and tactical guides to help you navigate acquiring, growing, and exiting businesses.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64 border border-white/10 bg-white/[0.02]">
            <p className="text-white/50 tracking-widest font-kiona uppercase text-sm">Loading resources...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 border border-white/10 bg-white/[0.02] gap-4">
            <p className="text-white/50 tracking-widest font-kiona uppercase text-sm">No articles published yet.</p>
            <p className="text-white/30 text-sm">Check back soon for new insights.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * idx }}
                className="group border border-white/10 bg-white/[0.02] overflow-hidden flex flex-col hover:border-[#D4AF37]/50 transition-colors duration-500"
              >
                {post.cover_image_url && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.cover_image_url} 
                      alt={post.hero_alt_text || post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-4">
                    {post.category && (
                      <span className="text-[#D4AF37] text-xs uppercase tracking-widest font-kiona font-bold">
                        {post.category}
                      </span>
                    )}
                    <span className="text-white/30 text-xs">
                      {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h2 className="text-2xl font-light mb-4 text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-white/50 text-sm leading-relaxed mb-8 flex-grow">
                    {post.meta_description || "Read more about this topic..."}
                  </p>
                  <Link 
                    to={`/resources/${post.slug}`}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-kiona font-bold text-white group-hover:text-[#D4AF37] transition-colors mt-auto"
                  >
                    Read Article
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="border-t border-white/10 mt-32">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-5xl font-light mb-6 tracking-tight">Need specific guidance?</h2>
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
