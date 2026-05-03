import { useState, useEffect } from "react";
import { Check, ExternalLink, TrendingUp, Eye, BookOpen, Clock, Mail, Users, ChevronDown, ChevronUp } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { supabase } from "../../lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

type Timeframe = "7" | "30" | "90" | "all";

interface KpiData {
  totalViews: number;
  totalReads: number;
  readRatio: number;
  avgTimeOnPage: number;
  totalSubscribers: number;
  blogSubscribers: number;
}

interface ChartPoint {
  date: string;
  views: number;
  reads: number;
  subs: number;
}

interface PostStat {
  post_id: string;
  post_slug: string;
  title: string;
  category: string | null;
  views: number;
  reads: number;
  readRatio: number;
  avgTime: number;
  subs: number;
}

interface CategoryStat {
  category: string;
  views: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSeconds(s: number): string {
  if (!s || s <= 0) return "—";
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

function formatNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function sinceDate(days: Timeframe): Date | null {
  if (days === "all") return null;
  const d = new Date();
  d.setDate(d.getDate() - parseInt(days));
  return d;
}

// ─── Custom tooltip for chart ─────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111] border border-white/10 px-4 py-3 text-xs font-sans">
      <p className="text-white/50 mb-2 font-kiona uppercase tracking-wider">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="mb-0.5">
          {p.name}: <span className="text-white">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

// ─── GA4 Settings (collapsible) ───────────────────────────────────────────────

const GA4_KEY = "cms_ga4_measurement_id";

function GA4Settings() {
  const [open, setOpen] = useState(false);
  const [ga4Id, setGa4Id] = useState(() => localStorage.getItem(GA4_KEY) ?? "");
  const [inputId, setInputId] = useState(ga4Id);
  const [saved, setSaved] = useState(false);
  const isConnected = !!ga4Id;

  const handleSave = () => {
    const trimmed = inputId.trim();
    localStorage.setItem(GA4_KEY, trimmed);
    setGa4Id(trimmed);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    if (trimmed) injectGA4(trimmed);
  };

  const handleDisconnect = () => {
    localStorage.removeItem(GA4_KEY);
    setGa4Id("");
    setInputId("");
  };

  useEffect(() => { if (ga4Id) injectGA4(ga4Id); }, []);

  return (
    <div className="border border-white/10 bg-white/[0.02]">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-kiona uppercase tracking-widest text-[#D4AF37]">Integrations</span>
          <span className="text-sm text-white/60">Google Analytics 4</span>
          <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-green-400" : "bg-white/20"}`} />
          <span className={`text-[10px] font-kiona uppercase tracking-widest ${isConnected ? "text-green-400" : "text-white/30"}`}>
            {isConnected ? "Connected" : "Not connected"}
          </span>
        </div>
        {open ? <ChevronUp size={14} className="text-white/40" /> : <ChevronDown size={14} className="text-white/40" />}
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-white/10 pt-4">
          <p className="text-xs text-white/40 font-sans mb-4">
            Enter your GA4 Measurement ID to enable Google Analytics tracking. Add the GA4 script to{" "}
            <code className="text-white/60">index.html</code> for reliable tracking of all visitors.
          </p>
          <div className="flex items-end gap-3 max-w-lg">
            <div className="flex-1">
              <label className="block text-[10px] uppercase font-kiona text-white/40 tracking-wider mb-2">
                Measurement ID
              </label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                value={inputId}
                onChange={e => setInputId(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 text-white focus:border-[#D4AF37]/50 font-sans outline-none px-4 py-3 text-sm"
              />
              <p className="text-[10px] text-white/30 mt-1 font-sans">
                GA4 → Admin → Data Streams → your stream → Measurement ID
              </p>
            </div>
            <div className="flex gap-2 pb-6">
              <button
                onClick={handleSave}
                className="bg-[#D4AF37] text-black px-5 py-3 text-[10px] font-bold font-kiona tracking-widest uppercase hover:bg-white transition-all"
              >
                {saved ? <span className="flex items-center gap-1"><Check size={12} /> Saved</span> : "Save"}
              </button>
              {isConnected && (
                <button
                  onClick={handleDisconnect}
                  className="border border-white/10 text-white/40 px-4 py-3 text-[10px] font-kiona uppercase tracking-widest hover:border-red-400/30 hover:text-red-400 transition-colors"
                >
                  Disconnect
                </button>
              )}
              {isConnected && (
                <a
                  href="https://analytics.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 border border-white/10 text-white/40 px-4 py-3 text-[10px] font-kiona uppercase tracking-widest hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-colors"
                >
                  Open GA4 <ExternalLink size={10} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function injectGA4(measurementId: string) {
  if (!measurementId || document.getElementById("ga4-script")) return;
  const s1 = document.createElement("script");
  s1.id = "ga4-script"; s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(s1);
  const s2 = document.createElement("script");
  s2.id = "ga4-init";
  s2.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${measurementId}');`;
  document.head.appendChild(s2);
}

// ─── Main Analytics Component ─────────────────────────────────────────────────

interface AnalyticsProps {
  publishedCount: number;
  posts: any[];
}

export default function Analytics({ publishedCount, posts }: AnalyticsProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>("30");
  const [loading, setLoading] = useState(true);
  const [kpi, setKpi] = useState<KpiData>({ totalViews: 0, totalReads: 0, readRatio: 0, avgTimeOnPage: 0, totalSubscribers: 0, blogSubscribers: 0 });
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [postStats, setPostStats] = useState<PostStat[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [sortCol, setSortCol] = useState<"views" | "reads" | "subs" | "readRatio">("views");
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [timeframe, posts]);

  async function loadAnalytics() {
    setLoading(true);
    const since = sinceDate(timeframe);

    // Build event query
    let evtQuery = supabase
      .from("analytics_events")
      .select("event_type, post_id, post_slug, category, time_on_page, created_at");
    if (since) evtQuery = evtQuery.gte("created_at", since.toISOString());
    const { data: events } = await evtQuery;

    // Newsletter subscribers
    let subQuery = supabase
      .from("newsletter_subscribers")
      .select("post_slug, source, created_at");
    if (since) subQuery = subQuery.gte("created_at", since.toISOString());
    const { data: subscribers } = await subQuery;

    const evts = events ?? [];
    const subs = subscribers ?? [];

    // ── KPIs ──
    const views = evts.filter(e => e.event_type === "post_view");
    const reads = evts.filter(e => e.event_type === "post_read");
    const readTimes = reads.filter(e => e.time_on_page != null).map(e => e.time_on_page as number);
    const avgTime = readTimes.length ? Math.round(readTimes.reduce((a, b) => a + b, 0) / readTimes.length) : 0;
    const blogSubs = subs.filter(s => s.source === "blog");

    setKpi({
      totalViews: views.length,
      totalReads: reads.length,
      readRatio: views.length > 0 ? Math.round((reads.length / views.length) * 100) : 0,
      avgTimeOnPage: avgTime,
      totalSubscribers: subs.length,
      blogSubscribers: blogSubs.length,
    });

    // ── Chart data ──
    const days = timeframe === "all" ? 90 : parseInt(timeframe);
    const pointMap = new Map<string, ChartPoint>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      pointMap.set(key, { date: key, views: 0, reads: 0, subs: 0 });
    }
    evts.forEach(e => {
      const key = new Date(e.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const pt = pointMap.get(key);
      if (!pt) return;
      if (e.event_type === "post_view") pt.views++;
      if (e.event_type === "post_read") pt.reads++;
    });
    subs.forEach(s => {
      const key = new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const pt = pointMap.get(key);
      if (pt) pt.subs++;
    });
    // Thin the chart if too many points (all-time → show every 3rd)
    let points = [...pointMap.values()];
    if (points.length > 60) points = points.filter((_, i) => i % 3 === 0);
    setChartData(points);

    // ── Post stats ──
    const postMap = new Map<string, PostStat>();
    posts.filter(p => p.is_published).forEach(p => {
      postMap.set(p.id, { post_id: p.id, post_slug: p.slug, title: p.title, category: p.category ?? null, views: 0, reads: 0, readRatio: 0, avgTime: 0, subs: 0 });
    });
    const readTimesPerPost = new Map<string, number[]>();
    evts.forEach(e => {
      if (!e.post_id) return;
      const stat = postMap.get(e.post_id);
      if (!stat) return;
      if (e.event_type === "post_view") stat.views++;
      if (e.event_type === "post_read") {
        stat.reads++;
        if (e.time_on_page) {
          if (!readTimesPerPost.has(e.post_id)) readTimesPerPost.set(e.post_id, []);
          readTimesPerPost.get(e.post_id)!.push(e.time_on_page);
        }
      }
    });
    subs.forEach(s => {
      if (!s.post_slug) return;
      for (const stat of postMap.values()) {
        if (stat.post_slug === s.post_slug) { stat.subs++; break; }
      }
    });
    postMap.forEach((stat, id) => {
      stat.readRatio = stat.views > 0 ? Math.round((stat.reads / stat.views) * 100) : 0;
      const times = readTimesPerPost.get(id) ?? [];
      stat.avgTime = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
    });
    setPostStats([...postMap.values()]);

    // ── Category breakdown ──
    const catMap = new Map<string, number>();
    evts.filter(e => e.event_type === "post_view" && e.category).forEach(e => {
      catMap.set(e.category!, (catMap.get(e.category!) ?? 0) + 1);
    });
    setCategoryStats([...catMap.entries()].map(([category, views]) => ({ category, views })).sort((a, b) => b.views - a.views));

    setLoading(false);
  }

  const sortedPosts = [...postStats].sort((a, b) => {
    const diff = (a[sortCol] as number) - (b[sortCol] as number);
    return sortAsc ? diff : -diff;
  });

  const maxCatViews = categoryStats[0]?.views ?? 1;
  const hasData = kpi.totalViews > 0 || kpi.totalReads > 0 || kpi.totalSubscribers > 0;

  const TIMEFRAMES: { label: string; value: Timeframe }[] = [
    { label: "7D", value: "7" },
    { label: "30D", value: "30" },
    { label: "90D", value: "90" },
    { label: "All", value: "all" },
  ];

  const kpiCards = [
    { label: "Total Views", value: formatNum(kpi.totalViews), icon: Eye, sub: "page loads" },
    { label: "Total Reads", value: formatNum(kpi.totalReads), icon: BookOpen, sub: "75% scroll depth" },
    { label: "Read Ratio", value: kpi.readRatio > 0 ? `${kpi.readRatio}%` : "—", icon: TrendingUp, sub: "reads / views" },
    { label: "Avg. Time on Post", value: formatSeconds(kpi.avgTimeOnPage), icon: Clock, sub: "at time of read" },
    { label: "Subscribers", value: formatNum(kpi.totalSubscribers), icon: Users, sub: "total newsletter" },
    { label: "Blog Subs", value: formatNum(kpi.blogSubscribers), icon: Mail, sub: "attributed to posts" },
  ];

  function handleSort(col: typeof sortCol) {
    if (sortCol === col) setSortAsc(v => !v);
    else { setSortCol(col); setSortAsc(false); }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-6xl mx-auto py-12 px-8">

      {/* Header */}
      <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-6">
        <div>
          <div className="text-[#D4AF37] text-[10px] uppercase tracking-widest font-kiona mb-2">Analytics</div>
          <h1 className="text-3xl font-light tracking-tight">Performance Dashboard</h1>
          <p className="text-sm text-white/50 mt-2 font-sans">Views, reads, and subscriber attribution — powered by your own data.</p>
        </div>
        {/* Timeframe filter */}
        <div className="flex border border-white/10">
          {TIMEFRAMES.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setTimeframe(value)}
              className={`px-4 py-2 text-[10px] font-kiona uppercase tracking-widest transition-colors ${
                timeframe === value
                  ? "bg-[#D4AF37] text-black"
                  : "text-white/50 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {kpiCards.map(({ label, value, icon: Icon, sub }) => (
          <div key={label} className="border border-white/10 bg-white/[0.02] p-5 hover:border-[#D4AF37]/20 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <Icon size={12} className="text-[#D4AF37]" />
              <p className="text-[9px] text-white/50 uppercase tracking-widest font-kiona">{label}</p>
            </div>
            <p className="text-2xl font-light text-white mb-1">{loading ? "—" : value}</p>
            <p className="text-[10px] text-white/30 font-sans">{sub}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="border border-white/10 bg-white/[0.02] p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-kiona mb-1">Performance Over Time</p>
            <p className="text-sm text-white/50 font-sans">Views, reads, and subscriber growth</p>
          </div>
        </div>
        {!loading && !hasData ? (
          <div className="h-48 flex flex-col items-center justify-center text-center gap-2">
            <p className="text-white/30 text-sm">No tracking data yet.</p>
            <p className="text-white/20 text-xs font-sans">Publish and share posts — events appear here as readers visit them.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 10, paddingTop: 12, fontFamily: "inherit", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }} />
              <Line type="monotone" dataKey="views" stroke="#D4AF37" strokeWidth={1.5} dot={false} name="Views" />
              <Line type="monotone" dataKey="reads" stroke="#a78c2e" strokeWidth={1.5} dot={false} name="Reads" />
              <Line type="monotone" dataKey="subs" stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} dot={false} name="Subscribers" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Post performance table */}
      <div className="border border-white/10 bg-white/[0.02] mb-8">
        <div className="px-6 py-4 border-b border-white/10">
          <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-kiona">Post Performance</p>
        </div>
        {!loading && sortedPosts.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-white/30 text-sm">{publishedCount === 0 ? "No published posts yet." : "No analytics data for this timeframe."}</p>
            <p className="text-white/20 text-xs font-sans mt-2">Share posts to start collecting performance data.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-sans">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-6 py-3 text-white/40 font-normal text-[10px] uppercase tracking-widest font-kiona">Article</th>
                  <th className="text-left px-4 py-3 text-white/40 font-normal text-[10px] uppercase tracking-widest font-kiona">Category</th>
                  {(["views", "reads", "readRatio", "subs"] as const).map(col => (
                    <th
                      key={col}
                      onClick={() => handleSort(col)}
                      className="text-right px-4 py-3 text-white/40 font-normal text-[10px] uppercase tracking-widest font-kiona cursor-pointer hover:text-white/70 select-none"
                    >
                      {col === "readRatio" ? "Read %" : col === "subs" ? "Subs" : col.charAt(0).toUpperCase() + col.slice(1)}
                      {sortCol === col && (sortAsc ? " ↑" : " ↓")}
                    </th>
                  ))}
                  <th className="text-right px-6 py-3 text-white/40 font-normal text-[10px] uppercase tracking-widest font-kiona">Avg Time</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td colSpan={6} className="px-6 py-4">
                        <div className="h-3 bg-white/[0.04] w-2/3" />
                      </td>
                    </tr>
                  ))
                  : sortedPosts.map(p => (
                    <tr key={p.post_id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 max-w-xs">
                        <span className="text-white/80 font-sans line-clamp-1">{p.title}</span>
                        <span className="block text-white/30 text-[10px] font-kiona mt-0.5">{p.post_slug}</span>
                      </td>
                      <td className="px-4 py-4">
                        {p.category ? (
                          <span className="text-[#D4AF37] text-[10px] font-kiona uppercase tracking-wider">{p.category}</span>
                        ) : (
                          <span className="text-white/20">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right text-white/70">{formatNum(p.views)}</td>
                      <td className="px-4 py-4 text-right text-white/70">{formatNum(p.reads)}</td>
                      <td className="px-4 py-4 text-right">
                        <span className={`${p.readRatio >= 60 ? "text-green-400" : p.readRatio >= 30 ? "text-white/70" : "text-white/40"}`}>
                          {p.views > 0 ? `${p.readRatio}%` : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right text-white/70">{formatNum(p.subs)}</td>
                      <td className="px-6 py-4 text-right text-white/50">{formatSeconds(p.avgTime)}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom row: Category breakdown + GA4 settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Category breakdown */}
        <div className="border border-white/10 bg-white/[0.02] p-6">
          <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-kiona mb-5">Category Breakdown</p>
          {!loading && categoryStats.length === 0 ? (
            <p className="text-white/30 text-sm py-8 text-center">No category data yet.</p>
          ) : (
            <div className="space-y-3">
              {(loading ? Array.from({ length: 4 }) : categoryStats).map((item: any, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1.5">
                    {loading ? (
                      <div className="h-2.5 bg-white/[0.04] w-24" />
                    ) : (
                      <>
                        <span className="text-white/70 font-kiona uppercase tracking-wider text-[10px]">{item.category}</span>
                        <span className="text-white/40">{formatNum(item.views)}</span>
                      </>
                    )}
                  </div>
                  <div className="h-1 bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full bg-[#D4AF37] transition-all duration-700"
                      style={{ width: loading ? "0%" : `${Math.round((item.views / maxCatViews) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Newsletter attribution */}
        <div className="border border-white/10 bg-white/[0.02] p-6">
          <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-kiona mb-5">Newsletter Attribution</p>
          {!loading && kpi.blogSubscribers === 0 ? (
            <p className="text-white/30 text-sm py-8 text-center">No subscriber attribution data yet.</p>
          ) : (
            <div className="space-y-3">
              {(loading ? Array.from({ length: 4 }) : postStats.filter(p => p.subs > 0).sort((a, b) => b.subs - a.subs).slice(0, 6)).map((item: any, i) => {
                const maxSubs = postStats.reduce((m, p) => Math.max(m, p.subs), 1);
                return (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1.5">
                      {loading ? (
                        <div className="h-2.5 bg-white/[0.04] w-32" />
                      ) : (
                        <>
                          <span className="text-white/70 font-sans line-clamp-1 flex-1 pr-4">{item.title}</span>
                          <span className="text-white/40 shrink-0">{item.subs} sub{item.subs !== 1 ? "s" : ""}</span>
                        </>
                      )}
                    </div>
                    <div className="h-1 bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full bg-[#D4AF37]/60 transition-all duration-700"
                        style={{ width: loading ? "0%" : `${Math.round((item.subs / maxSubs) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* GA4 collapsible */}
      <GA4Settings />
    </div>
  );
}
