import { Plus, ArrowUpRight } from "lucide-react";
import { formatDate } from "../../lib/utils";

interface DashboardProps {
  drafts: any[];
  published: any[];
  onNewPost: () => void;
  onOpenPost: (post: any) => void;
}

export default function Dashboard({ drafts, published, onNewPost, onOpenPost }: DashboardProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-6xl mx-auto py-12 px-8">
      <div className="flex justify-between items-end mb-10">
        <div>
          <div className="text-[#D4AF37] text-[10px] uppercase tracking-widest font-kiona mb-2">Dashboard</div>
          <h1 className="text-3xl font-light tracking-tight">Command Center</h1>
        </div>
        <button
          onClick={onNewPost}
          className="flex items-center gap-2 bg-white/[0.05] border border-white/10 px-5 py-3 hover:bg-white/10 text-xs tracking-widest uppercase font-kiona text-[#D4AF37] transition-all"
        >
          <Plus size={14} /> Quick Post
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Total Views", val: "—", sub: "Connect analytics to see insights" },
          { label: "Published Content", val: published.length.toString(), sub: "Live articles" },
          { label: "Pending Drafts", val: drafts.length.toString(), sub: "Awaiting action" },
          { label: "Avg Read Ratio", val: "—", sub: "Awaiting sufficient data" },
        ].map((stat, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/10 p-6 relative overflow-hidden group hover:border-[#D4AF37]/30 transition-all">
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-kiona mb-3">{stat.label}</p>
            <p className="text-3xl font-light text-white mb-2">{stat.val}</p>
            <p className="text-xs text-[#D4AF37]/80">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border border-white/10 p-6 bg-white/[0.01]">
          <h3 className="text-[#D4AF37] text-[10px] uppercase tracking-widest font-kiona border-b border-white/10 pb-4 mb-4">
            Recent Drafts
          </h3>
          <div className="flex flex-col">
            {drafts.slice(0, 5).map(d => (
              <div
                key={d.id}
                onClick={() => onOpenPost(d)}
                className="py-3 flex justify-between items-center group cursor-pointer border-b border-transparent hover:border-white/10"
              >
                <div className="truncate pr-4">
                  <span className="text-sm font-sans block group-hover:text-[#D4AF37] transition-colors">{d.title || 'Untitled Draft'}</span>
                  <span className="text-[10px] text-white/40 font-kiona tracking-wider">{formatDate(d.updated_at)}</span>
                </div>
                <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-50 text-[#D4AF37] shrink-0" />
              </div>
            ))}
            {drafts.length === 0 && <p className="text-xs text-white/40 italic py-4">No active drafts.</p>}
          </div>
        </div>

        <div className="border border-white/10 p-6 bg-white/[0.01]">
          <h3 className="text-[#D4AF37] text-[10px] uppercase tracking-widest font-kiona border-b border-white/10 pb-4 mb-4">
            Latest Published
          </h3>
          <div className="flex flex-col">
            {published.slice(0, 5).map(p => (
              <div
                key={p.id}
                onClick={() => onOpenPost(p)}
                className="py-3 flex justify-between items-center group cursor-pointer border-b border-transparent hover:border-white/10"
              >
                <div className="truncate pr-4">
                  <span className="text-sm font-sans block group-hover:text-[#D4AF37] transition-colors">{p.title}</span>
                  <span className="text-[10px] text-white/40 font-kiona tracking-wider">{formatDate(p.published_at)}</span>
                </div>
                <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-50 text-[#D4AF37] shrink-0" />
              </div>
            ))}
            {published.length === 0 && <p className="text-xs text-white/40 italic py-4">No published content yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
