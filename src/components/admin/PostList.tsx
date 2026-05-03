import { useState, useMemo, useEffect } from "react";
import { Plus, Copy, Trash, Eye, Pencil, Globe, GlobeLock, BarChart2 } from "lucide-react";
import { getStatus, formatDate } from "../../lib/utils";
import { supabase } from "../../lib/supabase";

interface PostListProps {
  displayPosts: any[];
  title: string;
  onNewPost: () => void;
  onEditPost: (post: any) => void;
  onDuplicate: (post: any, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onTogglePublish: (post: any) => void;
  onViewStats?: (post: any) => void;
}

type SortKey = "newest" | "oldest" | "last_edited" | "published" | "scheduled_asc";

interface PostStatsBadge {
  views: number;
  reads: number;
  subs: number;
}

export default function PostList({
  displayPosts, title,
  onNewPost, onEditPost, onDuplicate, onDelete, onTogglePublish, onViewStats,
}: PostListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "scheduled" | "published">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [statsMap, setStatsMap] = useState<Map<string, PostStatsBadge>>(new Map());

  const categories = useMemo(() => {
    const cats = [...new Set(displayPosts.map(p => p.category).filter(Boolean))];
    return cats;
  }, [displayPosts]);

  const filtered = useMemo(() => {
    let list = displayPosts;
    if (search) list = list.filter(p => (p.title ?? "").toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== "all") list = list.filter(p => getStatus(p) === statusFilter);
    if (categoryFilter !== "all") list = list.filter(p => p.category === categoryFilter);
    return list.slice().sort((a, b) => {
      if (sortKey === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortKey === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortKey === "last_edited") return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      if (sortKey === "published") return new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime();
      if (sortKey === "scheduled_asc") return new Date(a.published_at ?? 0).getTime() - new Date(b.published_at ?? 0).getTime();
      return 0;
    });
  }, [displayPosts, search, statusFilter, categoryFilter, sortKey]);

  // Fetch aggregate stats for all published posts in one query
  useEffect(() => {
    const publishedIds = displayPosts.filter(p => getStatus(p) === "published").map(p => p.id);
    if (publishedIds.length === 0) return;
    loadStats(publishedIds, displayPosts);
  }, [displayPosts]);

  async function loadStats(publishedIds: string[], allPosts: any[]) {
    const [eventsRes, subsRes] = await Promise.all([
      supabase
        .from("analytics_events")
        .select("event_type, post_id")
        .in("post_id", publishedIds),
      supabase
        .from("newsletter_subscribers")
        .select("post_slug")
        .not("post_slug", "is", null),
    ]);

    const events = eventsRes.data ?? [];
    const subs = subsRes.data ?? [];

    const map = new Map<string, PostStatsBadge>();
    publishedIds.forEach(id => map.set(id, { views: 0, reads: 0, subs: 0 }));

    events.forEach(e => {
      const s = map.get(e.post_id);
      if (!s) return;
      if (e.event_type === "post_view") s.views++;
      if (e.event_type === "post_read") s.reads++;
    });

    // Map subs by slug → post id
    const slugToId = new Map<string, string>();
    allPosts.forEach(p => slugToId.set(p.slug, p.id));
    subs.forEach(s => {
      const id = s.post_slug ? slugToId.get(s.post_slug) : undefined;
      if (id) { const stat = map.get(id); if (stat) stat.subs++; }
    });

    setStatsMap(map);
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-6xl mx-auto py-12 px-8">
      {/* Header */}
      <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight">{title}</h1>
          <p className="text-sm text-white/50 mt-2 font-sans">{filtered.length} post{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={onNewPost}
          className="flex items-center gap-2 bg-[#D4AF37] text-black px-5 py-3 text-[10px] font-bold font-kiona tracking-widest uppercase hover:bg-white transition-all"
        >
          <Plus size={14} /> New Post
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-white/10 bg-white/[0.02] text-xs font-sans px-3 py-2 outline-none focus:border-[#D4AF37]/50 transition-colors placeholder-white/30 w-48 text-white"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as any)}
          className="border border-white/10 bg-[#0a0a0a] text-xs font-sans px-3 py-2 outline-none focus:border-[#D4AF37]/50 text-white/70 cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Drafts</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
        </select>
        {categories.length > 0 && (
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="border border-white/10 bg-[#0a0a0a] text-xs font-sans px-3 py-2 outline-none focus:border-[#D4AF37]/50 text-white/70 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
        <select
          value={sortKey}
          onChange={e => setSortKey(e.target.value as SortKey)}
          className="border border-white/10 bg-[#0a0a0a] text-xs font-sans px-3 py-2 outline-none focus:border-[#D4AF37]/50 text-white/70 cursor-pointer ml-auto"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="last_edited">Last Edited</option>
          <option value="published">Published Date (newest)</option>
          <option value="scheduled_asc">Scheduled Date (soonest)</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="border border-white/10 bg-white/[0.02] p-16 flex flex-col items-center justify-center text-center">
          <h3 className="text-xl font-light mb-4">Nothing to display here</h3>
          <p className="text-sm text-white/50 max-w-md mb-8">This segment of your publishing platform is currently empty.</p>
          <button
            onClick={onNewPost}
            className="bg-[#D4AF37] text-black px-6 py-3 text-[10px] font-bold font-kiona tracking-widest uppercase hover:bg-white transition-all"
          >
            Start New Article
          </button>
        </div>
      ) : (
        <div className="border border-white/10 bg-white/[0.01]">
          <table className="w-full text-left font-sans text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[10px] tracking-widest font-kiona uppercase text-white/40">
                <th className="p-4 font-normal">Title</th>
                <th className="p-4 font-normal hidden md:table-cell">Category</th>
                <th className="p-4 font-normal">Status</th>
                <th className="p-4 font-normal hidden lg:table-cell">Stats</th>
                <th className="p-4 font-normal hidden lg:table-cell">Published</th>
                <th className="p-4 font-normal hidden lg:table-cell text-right">Edited</th>
                <th className="p-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const status = getStatus(p);
                const stats = statsMap.get(p.id);
                return (
                  <tr
                    key={p.id}
                    className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group cursor-pointer"
                    onClick={() => onEditPost(p)}
                  >
                    <td className="p-4 max-w-[220px] truncate font-medium group-hover:text-[#D4AF37] transition-colors">
                      {p.title || "Untitled"}
                    </td>
                    <td className="p-4 hidden md:table-cell text-white/60 text-xs">{p.category || "—"}</td>
                    <td className="p-4">
                      {status === "draft" && (
                        <span className="text-[10px] border border-white/10 px-2 py-1 font-kiona uppercase tracking-wider text-white/50">Draft</span>
                      )}
                      {status === "scheduled" && (
                        <span className="text-[10px] border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-2 py-1 font-kiona uppercase tracking-wider text-[#D4AF37]">Scheduled</span>
                      )}
                      {status === "published" && (
                        <span className="text-[10px] border border-white/40 bg-white/5 px-2 py-1 font-kiona uppercase tracking-wider text-white">Published</span>
                      )}
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      {stats ? (
                        <div className="flex items-center gap-3 text-[10px] font-kiona">
                          <span className="flex items-center gap-1 text-white/50" title="Views">
                            <Eye size={10} className="text-[#D4AF37]" /> {stats.views}
                          </span>
                          <span className="flex items-center gap-1 text-white/50" title="Reads">
                            <span className="text-[#D4AF37]">📖</span> {stats.reads}
                          </span>
                          {stats.subs > 0 && (
                            <span className="flex items-center gap-1 text-white/50" title="Subscribers">
                              <span className="text-[#D4AF37]">✉</span> {stats.subs}
                            </span>
                          )}
                        </div>
                      ) : (
                        status === "published" ? (
                          <span className="text-white/20 text-[10px] font-kiona">No data yet</span>
                        ) : null
                      )}
                    </td>
                    <td className="p-4 hidden lg:table-cell text-white/50 text-xs">
                      {p.published_at ? formatDate(p.published_at) : "—"}
                    </td>
                    <td className="p-4 hidden lg:table-cell text-right text-white/50 text-xs">
                      {formatDate(p.updated_at)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={e => { e.stopPropagation(); onEditPost(p); }}
                          className="text-white/40 hover:text-white p-1"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        {p.slug && (
                          <button
                            onClick={e => { e.stopPropagation(); window.open(`/resources/${p.slug}?preview=true`, "_blank"); }}
                            className="text-white/40 hover:text-[#D4AF37] p-1"
                            title="Preview"
                          >
                            <Eye size={14} />
                          </button>
                        )}
                        {status === "published" && onViewStats && (
                          <button
                            onClick={e => { e.stopPropagation(); onViewStats(p); }}
                            className="text-white/40 hover:text-[#D4AF37] p-1"
                            title="View Stats"
                          >
                            <BarChart2 size={14} />
                          </button>
                        )}
                        <button
                          onClick={e => { e.stopPropagation(); onTogglePublish(p); }}
                          className={`p-1 ${status === "published" ? "text-white/40 hover:text-red-400" : "text-white/40 hover:text-green-400"}`}
                          title={status === "published" ? "Unpublish" : "Publish"}
                        >
                          {status === "published" ? <GlobeLock size={14} /> : <Globe size={14} />}
                        </button>
                        <button
                          onClick={e => onDuplicate(p, e)}
                          className="text-white/40 hover:text-white p-1"
                          title="Duplicate"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={e => onDelete(p.id, e)}
                          className="text-white/40 hover:text-red-400 p-1"
                          title="Delete"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
