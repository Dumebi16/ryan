import { useState, useMemo } from "react";
import { Plus, Trash, Eye, Pencil, BarChart2 } from "lucide-react";
import { getStatus, formatDate } from "../../lib/utils";

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

const STATUS_STYLES: Record<string, string> = {
  draft:     "border border-white/10 text-white/40",
  scheduled: "border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]",
  published: "border border-white/30 bg-white/5 text-white",
};

export default function PostList({
  displayPosts, title,
  onNewPost, onEditPost, onDelete, onViewStats,
}: PostListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "scheduled" | "published">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("newest");

  const categories = useMemo(
    () => [...new Set(displayPosts.map(p => p.category).filter(Boolean))] as string[],
    [displayPosts]
  );

  const filtered = useMemo(() => {
    let list = displayPosts;
    if (search) list = list.filter(p => (p.title ?? "").toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== "all") list = list.filter(p => getStatus(p) === statusFilter);
    if (categoryFilter !== "all") list = list.filter(p => p.category === categoryFilter);
    return list.slice().sort((a, b) => {
      if (sortKey === "newest")        return new Date(b.created_at).getTime()    - new Date(a.created_at).getTime();
      if (sortKey === "oldest")        return new Date(a.created_at).getTime()    - new Date(b.created_at).getTime();
      if (sortKey === "last_edited")   return new Date(b.updated_at).getTime()    - new Date(a.updated_at).getTime();
      if (sortKey === "published")     return new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime();
      if (sortKey === "scheduled_asc") return new Date(a.published_at ?? 0).getTime() - new Date(b.published_at ?? 0).getTime();
      return 0;
    });
  }, [displayPosts, search, statusFilter, categoryFilter, sortKey]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-6xl mx-auto py-12 px-8">

      {/* Header */}
      <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight">{title}</h1>
          <p className="text-sm text-white/40 mt-1.5 font-sans">
            {filtered.length} post{filtered.length !== 1 ? "s" : ""}
          </p>
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
          className="border border-white/10 bg-white/[0.02] text-xs font-sans px-3 py-2 outline-none focus:border-[#D4AF37]/50 transition-colors placeholder-white/25 w-52 text-white"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as any)}
          className="border border-white/10 bg-[#0a0a0a] text-xs font-sans px-3 py-2 outline-none focus:border-[#D4AF37]/50 text-white/60 cursor-pointer"
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
            className="border border-white/10 bg-[#0a0a0a] text-xs font-sans px-3 py-2 outline-none focus:border-[#D4AF37]/50 text-white/60 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
        <select
          value={sortKey}
          onChange={e => setSortKey(e.target.value as SortKey)}
          className="border border-white/10 bg-[#0a0a0a] text-xs font-sans px-3 py-2 outline-none focus:border-[#D4AF37]/50 text-white/60 cursor-pointer ml-auto"
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
          <p className="text-sm text-white/50 max-w-md mb-8">
            This segment of your publishing platform is currently empty.
          </p>
          <button
            onClick={onNewPost}
            className="bg-[#D4AF37] text-black px-6 py-3 text-[10px] font-bold font-kiona tracking-widest uppercase hover:bg-white transition-all"
          >
            Start New Article
          </button>
        </div>
      ) : (
        <div className="border border-white/10 bg-white/[0.01] overflow-hidden">
          <table className="w-full text-left font-sans text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[10px] tracking-widest font-kiona uppercase text-white/30">
                <th className="px-5 py-4 font-normal">Title</th>
                <th className="px-5 py-4 font-normal hidden md:table-cell">Category</th>
                <th className="px-5 py-4 font-normal">Status</th>
                <th className="px-5 py-4 font-normal hidden lg:table-cell">Published</th>
                <th className="px-5 py-4 font-normal hidden lg:table-cell">Edited</th>
                <th className="px-5 py-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const status = getStatus(p);
                return (
                  <tr
                    key={p.id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.025] transition-colors group cursor-pointer"
                    onClick={() => onEditPost(p)}
                  >
                    {/* Title */}
                    <td className="px-5 py-4 max-w-[280px]">
                      <span className="block truncate font-medium text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
                        {p.title || "Untitled"}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-xs text-white/40 font-sans">
                        {p.category || "—"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`text-[10px] px-2.5 py-1 font-kiona uppercase tracking-wider ${STATUS_STYLES[status]}`}>
                        {status}
                      </span>
                    </td>

                    {/* Published */}
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-xs text-white/40 font-sans">
                        {p.published_at ? formatDate(p.published_at) : "—"}
                      </span>
                    </td>

                    {/* Edited */}
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-xs text-white/40 font-sans">
                        {formatDate(p.updated_at)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={e => { e.stopPropagation(); onEditPost(p); }}
                          className="text-white/40 hover:text-white p-1.5 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        {p.slug && (
                          <button
                            onClick={e => { e.stopPropagation(); window.open(`/resources/${p.slug}?preview=true`, "_blank"); }}
                            className="text-white/40 hover:text-[#D4AF37] p-1.5 transition-colors"
                            title="Preview"
                          >
                            <Eye size={14} />
                          </button>
                        )}
                        {status === "published" && onViewStats && (
                          <button
                            onClick={e => { e.stopPropagation(); onViewStats(p); }}
                            className="text-white/40 hover:text-[#D4AF37] p-1.5 transition-colors"
                            title="Analytics"
                          >
                            <BarChart2 size={14} />
                          </button>
                        )}
                        <button
                          onClick={e => onDelete(p.id, e)}
                          className="text-white/40 hover:text-red-400 p-1.5 transition-colors"
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
