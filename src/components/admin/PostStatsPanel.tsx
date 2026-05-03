import { useState, useEffect } from "react";
import { X, Eye, BookOpen, Clock, TrendingUp, Mail, ExternalLink } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "../../lib/supabase";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface PostStatsPanelProps {
  post: any;
  onClose: () => void;
}

interface Stats {
  views: number;
  reads: number;
  readRatio: number;
  avgTime: number;
  subs: number;
  ctaClicks: number;
  topReferrers: { referrer: string; count: number }[];
  chartData: { date: string; views: number; reads: number }[];
  subscribers: { email: string; created_at: string }[];
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatSeconds(s: number): string {
  if (!s || s <= 0) return "—";
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111] border border-white/10 px-3 py-2 text-[10px] font-sans">
      <p className="text-white/40 mb-1 font-kiona uppercase tracking-wider">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <span className="text-white">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function PostStatsPanel({ post, onClose }: PostStatsPanelProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    loadStats();
  }, [post.id]);

  async function loadStats() {
    setLoading(true);

    const [eventsRes, subsRes] = await Promise.all([
      supabase
        .from("analytics_events")
        .select("event_type, time_on_page, referrer, created_at")
        .eq("post_id", post.id),
      supabase
        .from("newsletter_subscribers")
        .select("email, created_at")
        .eq("post_slug", post.slug)
        .order("created_at", { ascending: false }),
    ]);

    const events = eventsRes.data ?? [];
    const subs = subsRes.data ?? [];

    const views = events.filter(e => e.event_type === "post_view");
    const reads = events.filter(e => e.event_type === "post_read");
    const ctaClicks = events.filter(e => e.event_type === "cta_click").length;
    const readTimes = reads.filter(e => e.time_on_page != null).map(e => e.time_on_page as number);
    const avgTime = readTimes.length ? Math.round(readTimes.reduce((a, b) => a + b, 0) / readTimes.length) : 0;

    // Top referrers
    const refMap = new Map<string, number>();
    views.forEach(e => {
      const ref = e.referrer || "Direct";
      refMap.set(ref, (refMap.get(ref) ?? 0) + 1);
    });
    const topReferrers = [...refMap.entries()]
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Chart data — last 30 days
    const pointMap = new Map<string, { date: string; views: number; reads: number }>();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      pointMap.set(key, { date: key, views: 0, reads: 0 });
    }
    events.forEach(e => {
      const key = new Date(e.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const pt = pointMap.get(key);
      if (!pt) return;
      if (e.event_type === "post_view") pt.views++;
      if (e.event_type === "post_read") pt.reads++;
    });

    setStats({
      views: views.length,
      reads: reads.length,
      readRatio: views.length > 0 ? Math.round((reads.length / views.length) * 100) : 0,
      avgTime,
      subs: subs.length,
      ctaClicks,
      topReferrers,
      chartData: [...pointMap.values()],
      subscribers: subs,
    });
    setLoading(false);
  }

  const kpiCards = stats ? [
    { label: "Views", value: stats.views.toString(), icon: Eye },
    { label: "Reads", value: stats.reads.toString(), icon: BookOpen },
    { label: "Read %", value: stats.views > 0 ? `${stats.readRatio}%` : "—", icon: TrendingUp },
    { label: "Avg Time", value: formatSeconds(stats.avgTime), icon: Clock },
    { label: "Subs", value: stats.subs.toString(), icon: Mail },
  ] : [];

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-xl bg-[#0a0a0a] border-l border-white/10 z-50 overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-[#0a0a0a] border-b border-white/10 px-6 py-4 flex items-start justify-between z-10">
          <div className="flex-1 pr-4">
            <div className="text-[#D4AF37] text-[9px] uppercase tracking-widest font-kiona mb-1">Post Analytics</div>
            <h2 className="text-lg font-light leading-snug line-clamp-2">{post.title}</h2>
            <div className="flex items-center gap-3 mt-2">
              {post.category && (
                <span className="text-[10px] font-kiona uppercase tracking-wider text-[#D4AF37]">{post.category}</span>
              )}
              {publishedDate && (
                <span className="text-[10px] text-white/30">Published {publishedDate}</span>
              )}
              {post.slug && (
                <a
                  href={`/resources/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-white/30 hover:text-[#D4AF37] transition-colors flex items-center gap-1"
                  onClick={e => e.stopPropagation()}
                >
                  View <ExternalLink size={9} />
                </a>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors p-1 shrink-0 mt-1"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* KPI row */}
          <div className="grid grid-cols-5 gap-2">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="border border-white/10 bg-white/[0.02] p-3">
                  <div className="h-2 bg-white/[0.05] mb-2 w-8" />
                  <div className="h-5 bg-white/[0.05] w-12" />
                </div>
              ))
              : kpiCards.map(({ label, value, icon: Icon }) => (
                <div key={label} className="border border-white/10 bg-white/[0.02] p-3 text-center">
                  <Icon size={11} className="text-[#D4AF37] mx-auto mb-2" />
                  <p className="text-[9px] text-white/40 uppercase tracking-widest font-kiona mb-1">{label}</p>
                  <p className="text-lg font-light">{value}</p>
                </div>
              ))
            }
          </div>

          {/* Trend chart — last 30 days */}
          <div className="border border-white/10 bg-white/[0.02] p-4">
            <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-kiona mb-4">Last 30 Days</p>
            {loading ? (
              <div className="h-32 bg-white/[0.02]" />
            ) : (
              <ResponsiveContainer width="100%" height={130}>
                <LineChart data={stats!.chartData} margin={{ top: 0, right: 4, left: -28, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="date" tick={{ fontSize: 8, fill: "rgba(255,255,255,0.25)" }} tickLine={false} axisLine={false} interval={6} />
                  <YAxis tick={{ fontSize: 8, fill: "rgba(255,255,255,0.25)" }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="views" stroke="#D4AF37" strokeWidth={1.5} dot={false} name="Views" />
                  <Line type="monotone" dataKey="reads" stroke="#a78c2e" strokeWidth={1.5} dot={false} name="Reads" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Traffic sources */}
          <div className="border border-white/10 bg-white/[0.02] p-4">
            <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-kiona mb-4">Traffic Sources</p>
            {loading ? (
              <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-3 bg-white/[0.04] w-full" />)}</div>
            ) : stats!.topReferrers.length === 0 ? (
              <p className="text-white/30 text-xs">No referrer data yet.</p>
            ) : (
              <div className="space-y-2">
                {stats!.topReferrers.map(({ referrer, count }) => {
                  const maxCount = stats!.topReferrers[0]?.count ?? 1;
                  return (
                    <div key={referrer}>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-white/60 font-sans truncate max-w-[280px]">{referrer}</span>
                        <span className="text-white/40 ml-2 shrink-0">{count}</span>
                      </div>
                      <div className="h-0.5 bg-white/[0.06]">
                        <div
                          className="h-full bg-[#D4AF37]/50"
                          style={{ width: `${Math.round((count / maxCount) * 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Newsletter subscribers from this post */}
          <div className="border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-kiona">Newsletter Subscribers</p>
              {!loading && stats!.subs > 0 && (
                <span className="text-[10px] text-white/30 font-kiona">{stats!.subs} total</span>
              )}
            </div>
            {loading ? (
              <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-3 bg-white/[0.04] w-2/3" />)}</div>
            ) : stats!.subscribers.length === 0 ? (
              <p className="text-white/30 text-xs">No subscribers attributed to this post yet.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {stats!.subscribers.map(s => (
                  <div key={s.email} className="flex items-center justify-between text-[11px]">
                    <span className="text-white/60 font-sans">{s.email}</span>
                    <span className="text-white/30 font-kiona text-[9px] ml-4 shrink-0">
                      {new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
