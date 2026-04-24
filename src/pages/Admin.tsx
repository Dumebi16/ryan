import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Plus, Settings, X, Check, Info, LayoutDashboard, FileText, FileEdit, Calendar, CheckCircle2, MoreVertical, Copy, Trash, PieChart, Activity, ArrowUpRight, UploadCloud, Database } from "lucide-react";
import RichTextEditor from "../components/RichTextEditor";

const Tooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-block ml-2 align-middle">
    <Info size={12} className="text-current opacity-40 hover:opacity-100 hover:text-[#D4AF37] cursor-help transition-all" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-black border border-white/10 text-white text-[10px] p-2 leading-relaxed opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl pointer-events-none rounded-none font-sans normal-case tracking-normal">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white/10"></div>
    </div>
  </div>
);

type Section = 'dashboard' | 'posts_all' | 'posts_drafts' | 'posts_scheduled' | 'posts_published' | 'analytics' | 'settings' | 'editor';

const getStatus = (post: any) => {
  if (!post.is_published) return 'draft';
  if (post.published_at && new Date(post.published_at) > new Date()) return 'scheduled';
  return 'published';
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
};

export default function Admin() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Layout states
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [posts, setPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"main" | "seo" | "quality">("main");
  const [toast, setToast] = useState<{show: boolean, msg: string, type: "success" | "error"}>({ show: false, msg: "", type: "success" });
  const [searchTerm, setSearchTerm] = useState("");

  // Formatting derived posts
  const drafts = posts.filter(p => getStatus(p) === 'draft');
  const scheduled = posts.filter(p => getStatus(p) === 'scheduled');
  const published = posts.filter(p => getStatus(p) === 'published');

  // Editor states
  const emptyDraft = {
    title: "", slug: "", category: "", read_time: 5, cover_image_url: "", hero_alt_text: "",
    is_published: false, published_at: "", markdown_content: "", excerpt: "",
    meta_title: "", meta_description: "", open_graph_image: "",
    twitter_title: "", twitter_description: "", noindex: false,
    geos: [], local_business_name: "", service_area: "",
    key_entities: [], target_queries: [], reference_links: [],
    primary_topic: "", secondary_topics: [], internal_links: [], external_links: [],
    originality_check: false, tone_of_voice: "expert-friendly", reading_level: "General web",
    accessibility_notes: "", legal_disclaimer: "", faqs: []
  };
  const [draft, setDraft] = useState<any>(emptyDraft);
  const [publishAction, setPublishAction] = useState<"draft" | "schedule" | "publish">("draft");

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  const duplicatePost = async (post: any, e: React.MouseEvent) => {
    e.stopPropagation();
    let payload = { ...post, title: `${post.title} (Copy)`, slug: `${post.slug}-copy`, is_published: false };
    delete payload.id; delete payload.post_faqs; delete payload.created_at; delete payload.updated_at;
    const { error } = await supabase.from("posts").insert([payload]);
    if (error) showToast("Error duplicating: " + error.message, "error");
    else { showToast("Post duplicated successfully", "success"); fetchPosts(); }
  };

  const deletePost = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this post?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) showToast("Error deleting: " + error.message, "error");
    else { showToast("Post deleted successfully", "success"); fetchPosts(); }
  };

  const savePost = async () => {
    setLoading(true);
    let payload = { ...draft, updated_at: new Date().toISOString() };
    
    // Auto-calculate slug if missing
    if (!payload.slug && payload.title) {
      payload.slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    // Validation
    if (!payload.title?.trim()) { showToast("Validation Error: Title is required.", "error"); setLoading(false); return; }
    if (!payload.slug?.trim()) { showToast("Validation Error: Slug is required to be generated.", "error"); setLoading(false); return; }

    // Workflow actions
    if (publishAction === "draft") {
      payload.is_published = false;
      payload.published_at = null;
    } else if (publishAction === "publish") {
      payload.is_published = true;
      if (!payload.published_at || new Date(payload.published_at) > new Date()) payload.published_at = new Date().toISOString();
    } else if (publishAction === "schedule") {
      payload.is_published = true;
      // published_at should be bound to the input
      if (!payload.published_at) {
        showToast("Validation Error: Scheduled date is required.", "error");
        setLoading(false); return;
      }
    }

    payload.read_time = parseInt(payload.read_time) || 0;
    delete payload.faqs; delete payload.post_faqs; delete payload.status;
    let postId = draft.id; if (!postId) delete payload.id;

    try {
      if (postId) {
         const { error } = await supabase.from("posts").update(payload).eq("id", postId);
         if (error) throw error;
         await supabase.from("post_faqs").delete().eq("post_id", postId);
      } else {
         const { data, error } = await supabase.from("posts").insert([payload]).select().single();
         if (error) throw error;
         if (data) { postId = data.id; setDraft({ ...draft, id: postId }); }
      }

      if (postId && draft.faqs && draft.faqs.length > 0) {
        const mappedFaqs = draft.faqs.map((faq: any, i: number) => ({ post_id: postId, question: faq.question || "", answer: faq.answer || "", position: i }));
        const { error: faqsError } = await supabase.from("post_faqs").insert(mappedFaqs);
        if (faqsError) throw faqsError;
      }

      showToast(`Success! Article ${payload.is_published ? (new Date(payload.published_at) > new Date() ? 'scheduled' : 'published') : 'saved as draft'}.`, "success");
      setLoading(false);
      fetchPosts(); 
    } catch (err: any) {
      showToast("Error saving post: " + err.message, "error");
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `post-images/${fileName}`;

    setLoading(true);
    try {
      showToast("Uploading media...", "success");
      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
      setDraft((prev: any) => ({ ...prev, [field]: publicUrl }));
      showToast("Image uploaded successfully.", "success");
    } catch (err: any) {
      showToast("Error uploading image: " + err.message, "error");
    }
    setLoading(false);
  };

  const NavItem = ({ icon, label, section, count, active, onClick }: { icon: any, label: string, section: Section, count?: number, active: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-all ${active ? 'bg-white/[0.05] text-[#D4AF37] border-l-2 border-[#D4AF37]' : 'text-white/60 hover:text-white hover:bg-white/[0.02] border-l-2 border-transparent'}`}>
       <span className={active ? 'opacity-100' : 'opacity-70'}>{icon}</span>
       <span>{label}</span>
       {count !== undefined && <span className={`ml-auto text-[9px] px-1.5 py-0.5 ${active ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-white/10 text-white/50'}`}>{count}</span>}
    </button>
  );

  const tInput = "bg-white/[0.03] border border-white/10 text-white focus:border-[#D4AF37]/50 font-sans normal-case";

  if (!session) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen text-white/90 flex flex-col justify-center items-center px-6 selection:bg-[#D4AF37] selection:text-black">
        <div className="max-w-md w-full border border-white/10 bg-white/[0.02] p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/10 filter blur-3xl z-0"></div>
          <div className="flex items-center gap-3 mb-8 justify-center relative z-10">
            <span className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase font-kiona font-bold">Admin Portal</span>
          </div>
          <h1 className="text-3xl font-light mb-8 text-center relative z-10">Ryan Kroge CMS</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-6 relative z-10">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-kiona text-white/50 mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50 font-sans" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-kiona text-white/50 mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50 font-sans" />
            </div>
            {error && <p className="text-red-400 text-sm font-sans">{error}</p>}
            <button type="submit" disabled={loading} className="mt-4 w-full bg-[#D4AF37] text-black px-10 py-4 text-[11px] font-bold font-kiona tracking-widest uppercase hover:bg-white transition-all transform hover:-translate-y-0.5" style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%)" }}>{loading ? "Signing in..." : "Access Context"}</button>
          </form>
        </div>
      </div>
    );
  }

  const renderDashboard = () => (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-6xl mx-auto py-12 px-8">
      <div className="flex justify-between items-end mb-10">
         <div>
           <div className="text-[#D4AF37] text-[10px] uppercase tracking-widest font-kiona mb-2">Dashboard</div>
           <h1 className="text-3xl font-light tracking-tight">Command Center</h1>
         </div>
         <button onClick={() => { setDraft(emptyDraft); setActiveSection('editor'); setPublishAction("draft"); }} className="flex items-center gap-2 bg-white/[0.05] border border-white/10 px-5 py-3 hover:bg-white/10 text-xs tracking-widest uppercase font-kiona text-[#D4AF37] transition-all"><Plus size={14}/> Quick Post</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
         {[
           { label: "Total Views", val: "—", sub: "Start publishing to see insights" },
           { label: "Published Content", val: published.length.toString(), sub: "In production" },
           { label: "Pending Drafts", val: drafts.length.toString(), sub: "Needs action" },
           { label: "Avg Read Ratio", val: "—", sub: "Awaiting sufficient data" }
         ].map((stat, i) => (
           <div key={i} className="bg-white/[0.02] border border-white/10 p-6 relative overflow-hidden group hover:border-[#D4AF37]/30 transition-all">
             <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-[#D4AF37]/5 to-transparent clip-diagonal-overlay transform translate-x-4 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none"></div>
             <p className="text-[10px] text-white/50 uppercase tracking-widest font-kiona mb-3">{stat.label}</p>
             <p className="text-3xl font-light text-white mb-2">{stat.val}</p>
             <p className="text-xs text-[#D4AF37]/80">{stat.sub}</p>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="border border-white/10 p-6 bg-white/[0.01]">
            <h3 className="text-[#D4AF37] text-[10px] uppercase tracking-widest font-kiona border-b border-white/10 pb-4 mb-4">Recent Drafts</h3>
            <div className="flex flex-col">
               {drafts.slice(0, 5).map(d => (
                 <div key={d.id} onClick={() => { setDraft(d); setActiveSection('editor'); }} className="py-3 flex justify-between items-center group cursor-pointer border-b border-transparent hover:border-white/10">
                   <div className="truncate pr-4"><span className="text-sm font-sans block group-hover:text-[#D4AF37] transition-colors">{d.title || 'Untitled Draft'}</span><span className="text-[10px] text-white/40 font-kiona tracking-wider">{formatDate(d.updated_at)}</span></div>
                   <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-50 text-[#D4AF37]" />
                 </div>
               ))}
               {drafts.length === 0 && <p className="text-xs text-white/40 italic py-4">No active drafts.</p>}
            </div>
         </div>
         <div className="border border-white/10 p-6 bg-white/[0.01]">
            <h3 className="text-[#D4AF37] text-[10px] uppercase tracking-widest font-kiona border-b border-white/10 pb-4 mb-4">Latest Published</h3>
            <div className="flex flex-col">
               {published.slice(0, 5).map(p => (
                 <div key={p.id} onClick={() => { setDraft(p); setActiveSection('editor'); }} className="py-3 flex justify-between items-center group cursor-pointer border-b border-transparent hover:border-white/10">
                   <div className="truncate pr-4"><span className="text-sm font-sans block group-hover:text-[#D4AF37] transition-colors">{p.title}</span><span className="text-[10px] text-white/40 font-kiona tracking-wider">{formatDate(p.published_at)}</span></div>
                   <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-50 text-[#D4AF37]" />
                 </div>
               ))}
               {published.length === 0 && <p className="text-xs text-white/40 italic py-4">No published content yet.</p>}
            </div>
         </div>
      </div>
    </div>
  );

  const renderPostList = (displayPosts: any[], title: string) => (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-6xl mx-auto py-12 px-8">
      <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-6">
         <div>
           <h1 className="text-3xl font-light tracking-tight">{title}</h1>
           <p className="text-sm text-white/50 mt-2 font-sans">{displayPosts.length} post{displayPosts.length !== 1 && 's'} in this context.</p>
         </div>
         <div className="relative">
           <input type="text" placeholder="Search articles..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-[200px] border border-white/10 bg-white/[0.02] text-xs font-sans p-2 outline-none focus:border-[#D4AF37]/50 transition-colors placeholder-white/30" />
         </div>
      </div>

      {displayPosts.filter(p => !searchTerm || (p.title || "").toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
        <div className="border border-white/10 bg-white/[0.02] p-16 flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-light mb-4">Nothing to display here</h3>
            <p className="text-sm text-white/50 max-w-md mb-8">This segment of your publishing platform is currently empty. Begin drafting your expertise to fill it.</p>
            <button onClick={() => { setDraft(emptyDraft); setActiveSection('editor'); setPublishAction("draft"); }} className="bg-[#D4AF37] text-black px-6 py-3 text-[10px] font-bold font-kiona tracking-widest uppercase hover:bg-white transition-all shadow-[4px_4px_0px_rgba(212,175,55,0.2)] hover:shadow-[4px_4px_0px_rgba(255,255,255,0.2)]">Start New Article</button>
        </div>
      ) : (
        <div className="border border-white/10 bg-white/[0.01]">
          <table className="w-full text-left font-sans text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[10px] tracking-widest font-kiona uppercase text-white/40">
                <th className="p-4 font-normal">Title</th>
                <th className="p-4 font-normal hidden md:table-cell">Category</th>
                <th className="p-4 font-normal">Status</th>
                <th className="p-4 font-normal hidden lg:table-cell text-right">Modified</th>
                <th className="p-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
               {displayPosts.filter(p => !searchTerm || (p.title || "").toLowerCase().includes(searchTerm.toLowerCase())).map(p => {
                 const status = getStatus(p);
                 return (
                 <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group cursor-pointer" onClick={() => { setDraft({...p, faqs: p.post_faqs || []}); setActiveSection('editor'); setPublishAction(status === 'published' ? 'publish' : (status === 'scheduled' ? 'schedule' : status)); }}>
                   <td className="p-4 max-w-[200px] truncate font-medium group-hover:text-[#D4AF37] transition-colors">{p.title || "Untitled"}</td>
                   <td className="p-4 hidden md:table-cell text-white/60">{p.category || "—"}</td>
                   <td className="p-4">
                      {status === 'draft' && <span className="text-[10px] border border-white/10 px-2 py-1 font-kiona uppercase tracking-wider text-white/50">Draft</span>}
                      {status === 'scheduled' && <span className="text-[10px] border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-2 py-1 font-kiona uppercase tracking-wider text-[#D4AF37]">Scheduled</span>}
                      {status === 'published' && <span className="text-[10px] border border-white/40 bg-white/5 px-2 py-1 font-kiona uppercase tracking-wider text-white">Published</span>}
                   </td>
                   <td className="p-4 hidden lg:table-cell text-right text-white/50 text-xs">{formatDate(p.updated_at)}</td>
                   <td className="p-4 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => duplicatePost(p, e)} className="text-white/40 hover:text-white" title="Duplicate"><Copy size={16} /></button>
                        <button onClick={(e) => deletePost(p.id, e)} className="text-white/40 hover:text-red-400" title="Delete"><Trash size={16} /></button>
                      </div>
                   </td>
                 </tr>
               )})}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-6xl mx-auto py-12 px-8">
      <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-6">
         <div>
           <h1 className="text-3xl font-light tracking-tight">Performance Analytics</h1>
           <p className="text-sm text-white/50 mt-2 font-sans">Comprehensive overview of engagement and reach.</p>
         </div>
      </div>
      
      <div className="border border-white/10 p-16 bg-white/[0.02] mb-8 flex flex-col items-center justify-center text-center h-[300px]">
          <h3 className="text-xl font-light mb-4">Awaiting Telemetry Data</h3>
          <p className="text-sm text-white/50 max-w-md">Once metrics are integrated via Supabase Tracking or Plausible Analytics, readership trends will visualize here. Start publishing to generate insights.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="border border-white/10 bg-white/[0.01] p-10 flex flex-col items-center justify-center text-center">
           <h3 className="text-[10px] font-kiona tracking-widest uppercase text-[#D4AF37] mb-2">Top Performing Content</h3>
           <p className="text-sm text-white/40 italic">No published content mapped to analytics yet.</p>
         </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto py-12 px-8">
      <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-6">
         <div>
           <div className="text-[#D4AF37] text-[10px] uppercase tracking-widest font-kiona mb-2">Configuration</div>
           <h1 className="text-3xl font-light tracking-tight">System Settings</h1>
         </div>
      </div>

      <div className="space-y-12">
        {/* General */}
        <section>
          <h3 className="text-lg font-light mb-6 border-b border-white/10 pb-2">General Architecture</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label className="block text-[10px] uppercase font-kiona text-white/50 tracking-wider mb-2">Platform Name</label>
               <input type="text" defaultValue="Ryan Kroge CMS" className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50 font-sans" />
            </div>
            <div>
               <label className="block text-[10px] uppercase font-kiona text-white/50 tracking-wider mb-2">Default Author Schema</label>
               <input type="text" defaultValue="Ryan Kroge" className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50 font-sans" />
            </div>
          </div>
        </section>

        {/* SEO Defaults */}
        <section>
          <h3 className="text-lg font-light mb-6 border-b border-white/10 pb-2">SEO & Context Defaults</h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
               <label className="block text-[10px] uppercase font-kiona text-white/50 tracking-wider mb-2">Global Meta Title Suffix</label>
               <input type="text" defaultValue=" | Ryan Kroge Consulting" className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50 font-sans" />
            </div>
            <div>
               <label className="block text-[10px] uppercase font-kiona text-white/50 tracking-wider mb-2">Default Open Graph Cover (Upload)</label>
               <div className="h-16 w-full max-w-sm border border-white/10 border-dashed hover:border-[#D4AF37]/50 transition-colors flex flex-col items-center justify-center relative cursor-pointer">
                  <span className="text-[10px] font-kiona uppercase text-white/50 flex items-center gap-2"><UploadCloud size={14}/> Upload Fallback OG Image</span>
               </div>
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section>
          <h3 className="text-lg font-light mb-6 border-b border-white/10 pb-2">Ecosystem Integrations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-white/10 bg-white/[0.01] p-6 text-center group cursor-pointer hover:border-[#D4AF37]/50 transition-all">
               <Activity className="mx-auto mb-3 text-white/30 group-hover:text-[#D4AF37] transition-all" />
               <h4 className="font-medium mb-1">Google Analytics 4</h4>
               <p className="text-xs text-white/40 mb-4">Connect real-time metric tracking.</p>
               <span className="text-[10px] font-kiona uppercase tracking-widest text-[#D4AF37]">Connect API</span>
            </div>
            <div className="border border-white/10 bg-white/[0.01] p-6 text-center group cursor-pointer hover:border-[#D4AF37]/50 transition-all">
               <Database className="mx-auto mb-3 text-[#D4AF37] transition-all" />
               <h4 className="font-medium mb-1">Supabase DB</h4>
               <p className="text-xs text-green-400/80 mb-4">Active & Connected.</p>
               <span className="text-[10px] font-kiona uppercase tracking-widest text-white/40">Manage Nodes</span>
            </div>
          </div>
        </section>

        <button className="bg-white/5 text-white px-6 py-4 text-[11px] font-bold font-kiona tracking-widest uppercase hover:bg-white hover:text-black transition-all">
          Save Configuration State
        </button>
      </div>
    </div>
  );

  const renderEditor = () => (
    <div className="flex h-full animate-in fade-in slide-in-from-right-4 duration-500 overflow-hidden font-sans bg-[#0a0a0a]">
       {/* Editor Main Canvas */}
       <div className="flex-1 overflow-y-auto px-12 py-10 relative pb-32">
          
          <div className="max-w-3xl mx-auto flex flex-col gap-10">
             
             {/* Title Block */}
             <div className="flex flex-col gap-4">
               <input
                  type="text"
                  placeholder="Article Title..."
                  value={draft.title}
                  onChange={e => setDraft({...draft, title: e.target.value})}
                  className="bg-transparent text-5xl font-light outline-none text-white placeholder-white/20 pb-4 border-b border-transparent focus:border-white/10 transition-colors"
               />
               <div className="flex items-center gap-4 text-xs font-sans text-white/40">
                  <span className="uppercase tracking-widest font-kiona text-[9px] text-[#D4AF37]">Slug</span>
                  <input type="text" placeholder="auto-generated-slug" value={draft.slug} onChange={e => setDraft({...draft, slug: e.target.value})} className="bg-transparent border-none outline-none w-full flex-1 hover:bg-white/[0.02] p-1"/>
               </div>
             </div>

             {/* Tab Switcher */}
             <div className="flex gap-1 border-b border-white/10 pb-px mt-4">
               <button onClick={() => setActiveTab('main')} className={`px-4 py-2 text-[10px] font-kiona uppercase tracking-widest transition-all ${activeTab === 'main' ? 'text-[#D4AF37] border-b border-[#D4AF37]' : 'text-white/40 hover:text-white'}`}>Editorial</button>
               <button onClick={() => setActiveTab('seo')} className={`px-4 py-2 text-[10px] font-kiona uppercase tracking-widest transition-all ${activeTab === 'seo' ? 'text-[#D4AF37] border-b border-[#D4AF37]' : 'text-white/40 hover:text-white'}`}>SEO / Data</button>
               <button onClick={() => setActiveTab('quality')} className={`px-4 py-2 text-[10px] font-kiona uppercase tracking-widest transition-all ${activeTab === 'quality' ? 'text-[#D4AF37] border-b border-[#D4AF37]' : 'text-white/40 hover:text-white'}`}>Compliance</button>
             </div>

             {/* Tab Canvas */}
             <div className="pt-2">
               {activeTab === 'main' && (
                 <div className="flex flex-col gap-8 animate-in fade-in duration-300">
                    <RichTextEditor 
                      value={draft.markdown_content} 
                      onChange={(val) => setDraft({...draft, markdown_content: val})} 
                    />
                    
                    <div className="border border-white/10 p-6 bg-white/[0.01]">
                       <label className="block text-[10px] uppercase font-kiona text-[#D4AF37] tracking-widest mb-4">Article Settings</label>
                       <div className="grid grid-cols-2 gap-6 mb-6">
                         <div>
                           <label className={`block text-[10px] uppercase font-kiona text-white/40 tracking-wider mb-2`}>Category</label>
                           <input list="categories-list" type="text" placeholder="e.g. Guides" value={draft.category} onChange={e => setDraft({...draft, category: e.target.value})} className={`w-full p-3 transition-colors outline-none ${tInput}`}/>
                           <datalist id="categories-list">
                             <option value="SBA Loans" />
                             <option value="Business Acquisition" />
                             <option value="Strategic Financial Guidance" />
                             <option value="Resources" />
                           </datalist>
                         </div>
                         <div><label className={`block text-[10px] uppercase font-kiona text-white/40 tracking-wider mb-2`}>Read Time (Mins)</label><input type="number" value={draft.read_time} onChange={e => setDraft({...draft, read_time: e.target.value})} className={`w-full p-3 transition-colors outline-none ${tInput}`}/></div>
                       </div>
                       <div className="grid grid-cols-2 gap-6">
                         <div className="col-span-2">
                           <label className={`block text-[10px] uppercase font-kiona text-white/40 tracking-wider mb-2`}>Cover Feature Image <Tooltip text="Upload a feature image for the post."/></label>
                           <div className="relative group">
                             {draft.cover_image_url ? (
                               <div className="relative h-48 w-full border border-white/10 overflow-hidden cursor-pointer">
                                 <img src={draft.cover_image_url} alt="Cover" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"><span className="bg-black/80 border border-white/10 text-white text-[10px] px-4 py-2 font-kiona uppercase tracking-widest shadow-xl backdrop-blur-md">Replace Media</span></div>
                                 <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleImageUpload(e, 'cover_image_url')} />
                               </div>
                             ) : (
                               <div className="h-48 w-full border border-white/10 border-dashed hover:border-[#D4AF37]/50 transition-colors flex flex-col items-center justify-center relative cursor-pointer bg-white/[0.01]">
                                 <UploadCloud size={24} className="text-white/30 mb-3"/>
                                 <span className="text-[10px] font-kiona tracking-widest uppercase text-[#D4AF37] mb-1">Click or Drag to Upload</span>
                                 <span className="text-[10px] text-white/30 uppercase">High fidelity files only</span>
                                 <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleImageUpload(e, 'cover_image_url')} />
                               </div>
                             )}
                           </div>
                         </div>
                         <div className="col-span-2"><label className={`block text-[10px] uppercase font-kiona text-white/40 tracking-wider mb-2`}>Cover Alt Text <Tooltip text="Describe the image contextually for screen readers and SEO Image Search."/></label><input type="text" placeholder="e.g. Ryan Kroge analyzing business acquisition documents" value={draft.hero_alt_text} onChange={e => setDraft({...draft, hero_alt_text: e.target.value})} className={`w-full p-3 transition-colors outline-none ${tInput}`}/></div>
                       </div>

                    </div>
                 </div>
               )}

               {activeTab === 'seo' && (
                 <div className="flex flex-col gap-10 animate-in fade-in duration-300">
                    <div>
                      <h3 className="text-[10px] font-kiona tracking-widest text-[#D4AF37] uppercase mb-4">Metadata</h3>
                      <div className="flex flex-col gap-5">
                       <div><label className="block text-xs font-sans text-white/50 mb-2">Generated Excerpt <Tooltip text="A brief summary displayed on the blog index cards. Keep it compelling and concise."/></label><textarea value={draft.excerpt} onChange={e => setDraft({...draft, excerpt: e.target.value})} className={`w-full p-3 h-24 outline-none transition-colors ${tInput}`}/></div>
                       <div><label className="block text-xs font-sans text-white/50 mb-2">Search Engine Title <Tooltip text="The blue, clickable title link that appears on Google Search results pages."/></label><input type="text" placeholder="e.g. SBA 7(a) Business Acquisition Guide" value={draft.meta_title} onChange={e => setDraft({...draft, meta_title: e.target.value})} className={`w-full p-3 transition-colors outline-none ${tInput}`}/></div>
                       <div><label className="block text-xs font-sans text-white/50 mb-2">Search Engine Description</label><textarea placeholder="e.g. Learn how to secure an SBA loan..." value={draft.meta_description} onChange={e => setDraft({...draft, meta_description: e.target.value})} className={`w-full p-3 h-20 outline-none transition-colors ${tInput}`}/></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-4">
                         <h3 className="text-[10px] font-kiona tracking-widest text-[#D4AF37] uppercase">People Also Ask (FAQs)</h3>
                         <button onClick={() => setDraft({...draft, faqs: [...(draft.faqs || []), { question: "", answer: "" }]})} className="text-[10px] uppercase font-kiona text-white hover:text-[#D4AF37] border border-white/20 px-3 py-1 flex items-center gap-1"><Plus size={12}/> Add</button>
                      </div>
                      <div className="flex flex-col gap-4">
                         {draft.faqs?.map((faq: any, i: number) => (
                           <div key={i} className="border border-white/10 p-4 bg-white/[0.01] relative group">
                             <button onClick={() => { const newFaqs = [...draft.faqs]; newFaqs.splice(i, 1); setDraft({...draft, faqs: newFaqs}); }} className="absolute top-4 right-4 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash size={14}/></button>
                             <input type="text" placeholder="Question" value={faq.question} onChange={e => { const newFaqs = [...draft.faqs]; newFaqs[i].question = e.target.value; setDraft({...draft, faqs: newFaqs}); }} className={`w-full mb-3 p-2 outline-none ${tInput}`}/>
                             <textarea placeholder="Answer" value={faq.answer} onChange={e => { const newFaqs = [...draft.faqs]; newFaqs[i].answer = e.target.value; setDraft({...draft, faqs: newFaqs}); }} className={`w-full h-20 resize-none p-2 outline-none ${tInput}`}/>
                           </div>
                         ))}
                         {(!draft.faqs || draft.faqs.length === 0) && <p className="text-sm text-white/40 italic">Incorporate FAQs to enhance AEO/Google visibility.</p>}
                      </div>
                    </div>
                 </div>
               )}

               {activeTab === 'quality' && (
                 <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                    <h3 className="text-[10px] font-kiona tracking-widest text-[#D4AF37] uppercase mb-4">Compliance & Strategy</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-xs font-sans text-white/50 mb-2">Tone of Voice Strategy</label><select value={draft.tone_of_voice || ''} onChange={e => setDraft({...draft, tone_of_voice: e.target.value})} className={`w-full p-3 transition-colors outline-none cursor-pointer ${tInput}`}><option value="expert-friendly">Expert-Friendly</option><option value="authoritative">Authoritative</option><option value="concise">Concise</option></select></div>
                      <div><label className="block text-xs font-sans text-white/50 mb-2">Reading Level Matrix</label><input type="text" placeholder="e.g. 5th Grade, Medical Professional" value={draft.reading_level} onChange={e => setDraft({...draft, reading_level: e.target.value})} className={`w-full p-3 transition-colors outline-none ${tInput}`}/></div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={draft.originality_check} onChange={e => setDraft({...draft, originality_check: e.target.checked})} className="accent-[#D4AF37] w-4 h-4"/><span className="text-sm">Human Originality Verified</span></label>
                    <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={draft.noindex} onChange={e => setDraft({...draft, noindex: e.target.checked})} className="accent-[#D4AF37] w-4 h-4"/><span className="text-sm text-red-300">Apply NOINDEX (Hide from Search Engines)</span></label>
                    <div><label className="block text-xs font-sans text-white/50 mb-2">Legal Disclaimer Subtext</label><textarea placeholder="e.g. The information provided does not constitute financial advice..." value={draft.legal_disclaimer} onChange={e => setDraft({...draft, legal_disclaimer: e.target.value})} className={`w-full p-3 h-24 outline-none transition-colors ${tInput}`}/></div>
                 </div>
               )}
             </div>
          </div>
       </div>

       {/* Right Utility & Publishing Panel */}
       <div className="w-[320px] border-l border-white/10 bg-[#070707] flex flex-col items-stretch overflow-y-auto z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
             <span className="text-[#D4AF37] text-[10px] uppercase font-kiona tracking-widest">Publish Context</span>
             <button onClick={() => setActiveSection('posts_all')} className="text-white/40 hover:text-white"><X size={16}/></button>
          </div>

          <div className="p-6 flex flex-col gap-6 flex-1">
             <div>
                <label className="block text-xs font-sans text-white/50 mb-3">Workflow State</label>
                <div className="flex flex-col gap-2">
                   <label className={`cursor-pointer p-3 border text-sm flex items-center gap-3 transition-colors ${publishAction === 'draft' ? 'border-[#D4AF37] bg-white/[0.05]' : 'border-white/10 bg-white/[0.01] opacity-60'}`}>
                      <input type="radio" name="state" value="draft" checked={publishAction === 'draft'} onChange={() => setPublishAction('draft')} className="accent-[#D4AF37]"/> Draft
                   </label>
                   <label className={`cursor-pointer p-3 border text-sm flex items-center gap-3 transition-colors ${publishAction === 'schedule' ? 'border-[#D4AF37] bg-white/[0.05]' : 'border-white/10 bg-white/[0.01] opacity-60'}`}>
                      <input type="radio" name="state" value="schedule" checked={publishAction === 'schedule'} onChange={() => setPublishAction('schedule')} className="accent-[#D4AF37]"/> Schedule
                   </label>
                   <label className={`cursor-pointer p-3 border text-sm flex items-center gap-3 transition-colors ${publishAction === 'publish' ? 'border-[#D4AF37] bg-white/[0.05]' : 'border-white/10 bg-white/[0.01] opacity-60'}`}>
                      <input type="radio" name="state" value="publish" checked={publishAction === 'publish'} onChange={() => setPublishAction('publish')} className="accent-[#D4AF37]"/> Publish Now
                   </label>
                </div>
             </div>

             {publishAction === 'schedule' && (
                <div className="animate-in fade-in zoom-in-95 duration-200">
                   <label className="block text-xs font-sans text-white/50 mb-2">Publication Date & Time</label>
                   <input type="datetime-local" value={draft.published_at ? new Date(draft.published_at).toISOString().slice(0,16) : ''} onChange={e => setDraft({...draft, published_at: new Date(e.target.value).toISOString()})} className={`w-full p-2 outline-none text-sm text-white ${tInput} [color-scheme:dark]`}/>
                </div>
             )}

             <div className="border border-white/10 p-4 bg-white/[0.02]">
                <div className="flex items-center gap-2 mb-2">
                   <Activity size={14} className="text-[#D4AF37]"/>
                   <span className="text-[10px] uppercase font-kiona tracking-widest text-[#D4AF37]">Article Intel</span>
                </div>
                <div className="flex justify-between text-xs py-1 text-white/60"><span>Word Count:</span> <span>{draft.markdown_content ? draft.markdown_content.trim().split(/\s+/).length : 0}</span></div>
                <div className="flex justify-between text-xs py-1 text-white/60"><span>Est. Reading Time:</span> <span>{draft.read_time} min</span></div>
                <div className="flex justify-between text-xs py-1 text-white/60"><span>Last Saved:</span> <span>{draft.updated_at ? formatDate(draft.updated_at) : 'Never'}</span></div>
                
                {draft.slug && (
                   <a href={`/resources/${draft.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-xs py-1 mt-3 border-t border-white/10 pt-3 text-white/80 hover:text-[#D4AF37] transition-colors">
                     <span>Preview Live Article</span>
                     <ArrowUpRight size={14} />
                   </a>
                )}
             </div>
          </div>

          <div className="p-6 border-t border-white/10 bg-black/50 sticky bottom-0">
             <button onClick={savePost} disabled={loading} className="w-full bg-[#D4AF37] text-black px-6 py-4 text-[11px] font-bold font-kiona tracking-widest uppercase hover:bg-white transition-all transform hover:-translate-y-0.5 shadow-[4px_4px_0px_rgba(255,255,255,0.1)]">
               {loading ? "Syncing..." : (publishAction === 'draft' ? "Save Draft" : (publishAction === 'schedule' ? "Schedule Post" : "Publish Article"))}
             </button>
          </div>
       </div>
    </div>
  );

  const renderToast = () => {
    if (!toast.show) return null;
    return (
      <div className={`fixed bottom-6 right-6 p-4 border shadow-2xl z-50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 ${toast.type === "error" ? "bg-red-500/10 text-red-500 border-red-500/20 bg-black/80 backdrop-blur-md" : "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20 bg-black/80 backdrop-blur-md"}`}>
        {toast.type === "error" ? <X size={16} /> : <Check size={16} />}
        <span className="text-xs uppercase tracking-widest font-kiona">{toast.msg}</span>
      </div>
    );
  };

  return (
    <div className={`bg-[#0a0a0a] min-h-screen text-white/90 grid md:grid-cols-[240px_1fr] selection:bg-[#D4AF37] selection:text-black overflow-hidden font-sans`}>
       {renderToast()}
       
       {/* SIDEBAR PANEL */}
       <aside className="border-r border-white/10 flex flex-col h-screen sticky top-0 bg-[#0a0a0a] z-30">
          <div className="p-6 border-b border-white/10 flex flex-col gap-1 items-start">
             <span className="text-[#D4AF37] text-[9px] uppercase font-kiona tracking-widest">Admin Control</span>
             <span className="text-lg font-light tracking-tight">System</span>
          </div>
          <div className="p-4">
            <button onClick={() => { setDraft(emptyDraft); setActiveSection('editor'); setPublishAction("draft"); }} className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] text-black px-4 py-3 text-[10px] font-bold font-kiona tracking-widest uppercase hover:bg-white transition-all" style={{ clipPath: "polygon(0 0, 100% 0, 100% 88%, 95% 100%, 0 100%)" }}><Plus size={14} /> New Post</button>
          </div>
          <nav className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-1">
             <NavItem icon={<LayoutDashboard size={14}/>} label="Dashboard" section="dashboard" active={activeSection==='dashboard'} onClick={() => setActiveSection('dashboard')} />
             <div className="mt-6 mb-2 text-white/30 px-3 text-[9px] font-kiona tracking-widest uppercase">Content</div>
             <NavItem icon={<FileText size={14}/>} label="All Posts" count={posts.length} section="posts_all" active={activeSection==='posts_all'} onClick={() => setActiveSection('posts_all')} />
             <NavItem icon={<FileEdit size={14}/>} label="Drafts" count={drafts.length} section="posts_drafts" active={activeSection==='posts_drafts'} onClick={() => setActiveSection('posts_drafts')} />
             <NavItem icon={<Calendar size={14}/>} label="Scheduled" count={scheduled.length} section="posts_scheduled" active={activeSection==='posts_scheduled'} onClick={() => setActiveSection('posts_scheduled')} />
             <NavItem icon={<CheckCircle2 size={14}/>} label="Published" count={published.length} section="posts_published" active={activeSection==='posts_published'} onClick={() => setActiveSection('posts_published')} />
             <div className="mt-6 mb-2 text-white/30 px-3 text-[9px] font-kiona tracking-widest uppercase">Insights</div>
             <NavItem icon={<PieChart size={14}/>} label="Analytics" section="analytics" active={activeSection==='analytics'} onClick={() => setActiveSection('analytics')} />
             <div className="mt-auto pt-4 pb-2 border-t border-white/10 flex flex-col gap-1">
               <NavItem icon={<Settings size={14}/>} label="Settings" section="settings" active={activeSection==='settings'} onClick={() => setActiveSection('settings')} />
             </div>
          </nav>
          <div className="p-4 border-t border-white/10 flex items-center justify-between gap-3">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-xs font-kiona font-bold text-[#D4AF37] border border-[#D4AF37]/30">RK</div>
               <div className="flex flex-col"><span className="text-xs uppercase font-kiona tracking-widest">Ryan Kroge</span><span className="text-[9px] text-[#D4AF37] font-sans">Admin</span></div>
             </div>
             <button onClick={() => supabase.auth.signOut()} className="text-white/40 hover:text-white transition-colors"><X size={14} /></button>
          </div>
       </aside>

       {/* MAIN WORKSPACE PANEL */}
       <main className="h-screen overflow-y-auto relative bg-[#0a0a0a]">
         {activeSection === 'dashboard' && renderDashboard()}
         {activeSection === 'posts_all' && renderPostList(posts, "All Posts")}
         {activeSection === 'posts_drafts' && renderPostList(drafts, "Draft Files")}
         {activeSection === 'posts_scheduled' && renderPostList(scheduled, "Scheduled Content")}
         {activeSection === 'posts_published' && renderPostList(published, "Live Articles")}
         {activeSection === 'analytics' && renderAnalytics()}
         {activeSection === 'settings' && renderSettings()}
         {activeSection === 'editor' && renderEditor()}
       </main>
    </div>
  );
}
