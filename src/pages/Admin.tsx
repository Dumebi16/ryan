import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import { getStatus } from "../lib/utils";
import AdminSidebar, { type Section } from "../components/admin/AdminSidebar";
import Dashboard from "../components/admin/Dashboard";
import PostList from "../components/admin/PostList";
import PostEditor from "../components/admin/PostEditor";
import Analytics from "../components/admin/Analytics";
import ProfilePage from "../components/admin/ProfilePage";
import PostStatsPanel from "../components/admin/PostStatsPanel";

const emptyDraft = {
  title: "", slug: "", category: "", read_time: 5, cover_image_url: "", hero_alt_text: "",
  is_published: false, published_at: "", markdown_content: "", excerpt: "",
  meta_title: "", meta_description: "", open_graph_image: "", canonical_url: "",
  twitter_title: "", twitter_description: "", noindex: false,
  geos: [], local_business_name: "", service_area: "",
  key_entities: [], target_queries: [], reference_links: [],
  primary_topic: "", secondary_topics: [], internal_links: [], external_links: [],
  originality_check: false, tone_of_voice: "expert-friendly", reading_level: "General web",
  accessibility_notes: "", legal_disclaimer: "", faqs: [],
};

export default function Admin() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ show: boolean; msg: string; type: "success" | "error" }>({ show: false, msg: "", type: "success" });

  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [posts, setPosts] = useState<any[]>([]);
  const [draft, setDraft] = useState<any>(emptyDraft);
  const [publishAction, setPublishAction] = useState<"draft" | "schedule" | "publish">("draft");
  const [statsPost, setStatsPost] = useState<any>(null);

  const drafts = posts.filter(p => getStatus(p) === "draft");
  const scheduled = posts.filter(p => getStatus(p) === "scheduled");
  const published = posts.filter(p => getStatus(p) === "published");

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3500);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) fetchPosts();
  }, [session]);

  const fetchPosts = async () => {
    const { data } = await supabase.from("posts").select("*, post_faqs(*)").order("created_at", { ascending: false });
    if (data) setPosts(data);
  };

  const refreshSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setLoginError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoginError(error.message);
    setLoading(false);
  };

  const openPost = (post: any) => {
    setDraft({ ...post, faqs: post.post_faqs || [] });
    setPublishAction(getStatus(post) === "published" ? "publish" : getStatus(post) === "scheduled" ? "schedule" : "draft");
    setActiveSection("editor");
  };

  const newPost = () => {
    setDraft(emptyDraft);
    setPublishAction("draft");
    setActiveSection("editor");
  };

  const duplicatePost = async (post: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const payload = { ...post, title: `${post.title} (Copy)`, slug: `${post.slug}-copy`, is_published: false };
    delete payload.id; delete payload.post_faqs; delete payload.created_at; delete payload.updated_at;
    const { error } = await supabase.from("posts").insert([payload]);
    if (error) showToast("Error duplicating: " + error.message, "error");
    else { showToast("Post duplicated.", "success"); fetchPosts(); }
  };

  const deletePost = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this post permanently?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) showToast("Error deleting: " + error.message, "error");
    else { showToast("Post deleted.", "success"); fetchPosts(); }
  };

  const togglePublish = async (post: any) => {
    const nowPublished = !post.is_published;
    const { error } = await supabase.from("posts").update({
      is_published: nowPublished,
      published_at: nowPublished ? new Date().toISOString() : null,
    }).eq("id", post.id);
    if (error) showToast("Error: " + error.message, "error");
    else { showToast(nowPublished ? "Post published." : "Post unpublished.", "success"); fetchPosts(); }
  };

  const savePost = async () => {
    setLoading(true);
    let payload = { ...draft, updated_at: new Date().toISOString() };

    if (!payload.slug && payload.title) {
      payload.slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    }
    if (!payload.title?.trim()) { showToast("Title is required.", "error"); setLoading(false); return; }
    if (!payload.slug?.trim()) { showToast("Slug is required.", "error"); setLoading(false); return; }

    if (publishAction === "draft") {
      payload.is_published = false; payload.published_at = null;
    } else if (publishAction === "publish") {
      payload.is_published = true;
      if (!payload.published_at || new Date(payload.published_at) > new Date()) payload.published_at = new Date().toISOString();
    } else if (publishAction === "schedule") {
      payload.is_published = true;
      if (!payload.published_at) { showToast("Scheduled date is required.", "error"); setLoading(false); return; }
    }

    payload.read_time = parseInt(payload.read_time) || 0;
    const faqs = draft.faqs || [];
    delete payload.faqs; delete payload.post_faqs; delete payload.status;
    let postId = draft.id;
    if (!postId) delete payload.id;

    try {
      if (postId) {
        const { error } = await supabase.from("posts").update(payload).eq("id", postId);
        if (error) throw error;
        await supabase.from("post_faqs").delete().eq("post_id", postId);
      } else {
        const { data, error } = await supabase.from("posts").insert([payload]).select().single();
        if (error) throw error;
        if (data) { postId = data.id; setDraft((prev: any) => ({ ...prev, id: postId })); }
      }

      if (postId && faqs.length > 0) {
        const mapped = faqs.map((faq: any, i: number) => ({ post_id: postId, question: faq.question || "", answer: faq.answer || "", position: i }));
        const { error: faqError } = await supabase.from("post_faqs").insert(mapped);
        if (faqError) throw faqError;
      }

      const action = payload.is_published ? (new Date(payload.published_at) > new Date() ? "scheduled" : "published") : "saved as draft";
      showToast(`Article ${action}.`, "success");
      fetchPosts();
    } catch (err: any) {
      showToast("Error saving: " + err.message, "error");
    }
    setLoading(false);
  };

  // ── Login screen ──────────────────────────────────────────────────────────────
  if (!session) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen text-white/90 flex flex-col justify-center items-center px-6 selection:bg-[#D4AF37] selection:text-black">
        <div className="max-w-md w-full border border-white/10 bg-white/[0.02] p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/10 filter blur-3xl z-0" />
          <div className="flex items-center gap-3 mb-8 justify-center relative z-10">
            <span className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase font-kiona font-bold">Admin Portal</span>
          </div>
          <h1 className="text-3xl font-light mb-8 text-center relative z-10">Ryan Kroge CMS</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-6 relative z-10">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-kiona text-white/50 mb-2">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50 font-sans" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-kiona text-white/50 mb-2">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50 font-sans" />
            </div>
            {loginError && <p className="text-red-400 text-sm font-sans">{loginError}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-[#D4AF37] text-black px-10 py-4 text-[11px] font-bold font-kiona tracking-widest uppercase hover:bg-white transition-all"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%)" }}
            >
              {loading ? "Signing in..." : "Access Portal"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Main admin shell ──────────────────────────────────────────────────────────
  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white/90 grid md:grid-cols-[240px_1fr] selection:bg-[#D4AF37] selection:text-black overflow-hidden font-sans">
      {/* Toast */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 p-4 border shadow-2xl z-50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 ${
          toast.type === "error"
            ? "bg-red-500/10 text-red-500 border-red-500/20 bg-black/80 backdrop-blur-md"
            : "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20 bg-black/80 backdrop-blur-md"
        }`}>
          {toast.type === "error" ? <X size={16} /> : <Check size={16} />}
          <span className="text-xs uppercase tracking-widest font-kiona">{toast.msg}</span>
        </div>
      )}

      {/* Sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        session={session}
        postsCount={posts.length}
        draftsCount={drafts.length}
        scheduledCount={scheduled.length}
        publishedCount={published.length}
        onNewPost={newPost}
        onSignOut={() => supabase.auth.signOut()}
      />

      {/* Main workspace */}
      <main className="h-screen overflow-y-auto relative bg-[#0a0a0a]">
        {activeSection === "dashboard" && (
          <Dashboard drafts={drafts} published={published} onNewPost={newPost} onOpenPost={openPost} />
        )}
        {activeSection === "posts_all" && (
          <PostList displayPosts={posts} title="All Posts" onNewPost={newPost} onEditPost={openPost}
            onDuplicate={duplicatePost} onDelete={deletePost} onTogglePublish={togglePublish} onViewStats={setStatsPost} />
        )}
        {activeSection === "posts_drafts" && (
          <PostList displayPosts={drafts} title="Draft Files" onNewPost={newPost} onEditPost={openPost}
            onDuplicate={duplicatePost} onDelete={deletePost} onTogglePublish={togglePublish} onViewStats={setStatsPost} />
        )}
        {activeSection === "posts_scheduled" && (
          <PostList displayPosts={scheduled} title="Scheduled Content" onNewPost={newPost} onEditPost={openPost}
            onDuplicate={duplicatePost} onDelete={deletePost} onTogglePublish={togglePublish} onViewStats={setStatsPost} />
        )}
        {activeSection === "posts_published" && (
          <PostList displayPosts={published} title="Live Articles" onNewPost={newPost} onEditPost={openPost}
            onDuplicate={duplicatePost} onDelete={deletePost} onTogglePublish={togglePublish} onViewStats={setStatsPost} />
        )}
        {activeSection === "analytics" && (
          <Analytics publishedCount={published.length} posts={posts} />
        )}
        {activeSection === "profile" && (
          <ProfilePage session={session} showToast={showToast} onSessionRefresh={refreshSession} />
        )}
        {activeSection === "settings" && (
          <ProfilePage session={session} showToast={showToast} onSessionRefresh={refreshSession} />
        )}
        {activeSection === "editor" && (
          <div className="h-full">
            <PostEditor
              draft={draft}
              setDraft={setDraft}
              publishAction={publishAction}
              setPublishAction={setPublishAction}
              savePost={savePost}
              loading={loading}
              onClose={() => setActiveSection("posts_all")}
            />
          </div>
        )}
      </main>

      {/* Per-post stats panel */}
      {statsPost && (
        <PostStatsPanel post={statsPost} onClose={() => setStatsPost(null)} />
      )}
    </div>
  );
}
