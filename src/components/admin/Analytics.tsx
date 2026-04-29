import { useState, useEffect } from "react";
import { Check, ExternalLink } from "lucide-react";

interface AnalyticsProps {
  publishedCount: number;
}

const GA4_KEY = 'cms_ga4_measurement_id';

export default function Analytics({ publishedCount }: AnalyticsProps) {
  const [ga4Id, setGa4Id] = useState(() => localStorage.getItem(GA4_KEY) ?? '');
  const [inputId, setInputId] = useState(ga4Id);
  const [saved, setSaved] = useState(false);

  const isConnected = !!ga4Id;

  const handleSave = () => {
    const trimmed = inputId.trim();
    localStorage.setItem(GA4_KEY, trimmed);
    setGa4Id(trimmed);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);

    // Inject GA4 script if an ID is provided
    if (trimmed) {
      injectGA4(trimmed);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem(GA4_KEY);
    setGa4Id('');
    setInputId('');
  };

  useEffect(() => {
    if (ga4Id) injectGA4(ga4Id);
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-6xl mx-auto py-12 px-8">
      <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-6">
        <div>
          <div className="text-[#D4AF37] text-[10px] uppercase tracking-widest font-kiona mb-2">Insights</div>
          <h1 className="text-3xl font-light tracking-tight">Performance Analytics</h1>
          <p className="text-sm text-white/50 mt-2 font-sans">Readership, reach, and engagement.</p>
        </div>
        <div className={`flex items-center gap-2 text-[10px] font-kiona uppercase tracking-widest ${isConnected ? 'text-green-400' : 'text-white/30'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-400' : 'bg-white/20'}`} />
          {isConnected ? 'GA4 Connected' : 'Not Connected'}
        </div>
      </div>

      {/* GA4 Setup */}
      <div className="border border-white/10 p-8 bg-white/[0.02] mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-sm font-medium mb-1">Google Analytics 4</h3>
            <p className="text-xs text-white/40 font-sans">
              Connect your GA4 property to track post views, reads, and traffic over time.
            </p>
          </div>
          {isConnected && (
            <a
              href={`https://analytics.google.com/`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[10px] font-kiona uppercase text-[#D4AF37] hover:text-white transition-colors"
            >
              Open GA4 <ExternalLink size={10} />
            </a>
          )}
        </div>

        <div className="flex items-center gap-3 mb-2">
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
              Found in GA4 → Admin → Data Streams → your stream → Measurement ID
            </p>
          </div>
          <div className="flex items-end gap-2 pb-6">
            <button
              onClick={handleSave}
              className="bg-[#D4AF37] text-black px-5 py-3 text-[10px] font-bold font-kiona tracking-widest uppercase hover:bg-white transition-all"
            >
              {saved ? <span className="flex items-center gap-1"><Check size={12} /> Saved</span> : 'Save'}
            </button>
            {isConnected && (
              <button
                onClick={handleDisconnect}
                className="border border-white/10 text-white/40 px-4 py-3 text-[10px] font-kiona uppercase tracking-widest hover:border-red-400/30 hover:text-red-400 transition-colors"
              >
                Disconnect
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Status / data panels */}
      {!isConnected ? (
        <div className="border border-white/10 p-16 bg-white/[0.01] mb-8 flex flex-col items-center justify-center text-center">
          <h3 className="text-xl font-light mb-4">No Analytics Data</h3>
          <p className="text-sm text-white/50 max-w-md mb-8">
            {publishedCount === 0
              ? 'Publish articles first, then connect GA4 above to begin tracking.'
              : `${publishedCount} article${publishedCount !== 1 ? 's' : ''} published. Enter your GA4 Measurement ID above to start tracking.`}
          </p>
          <div className="text-left max-w-xs w-full space-y-3">
            {[
              { step: '1', text: 'Publish at least one article', done: publishedCount > 0 },
              { step: '2', text: 'Enter GA4 Measurement ID above', done: false },
              { step: '3', text: 'View real data in GA4 dashboard', done: false },
            ].map(({ step, text, done }) => (
              <div key={step} className="flex items-center gap-4">
                <span className={`w-6 h-6 border flex items-center justify-center text-[10px] font-kiona shrink-0 ${done ? 'border-[#D4AF37]/60 text-[#D4AF37]' : 'border-white/10 text-white/30'}`}>
                  {done ? <Check size={10} /> : step}
                </span>
                <span className={`text-sm ${done ? 'text-white/30 line-through' : 'text-white/60'}`}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="border border-white/10 p-12 bg-white/[0.01] mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-green-400 font-kiona uppercase tracking-widest">Tracking Active</span>
          </div>
          <p className="text-white/40 text-sm font-sans max-w-sm mx-auto">
            GA4 is receiving data. Open your GA4 dashboard to view post views, traffic sources, and user behavior.
          </p>
          <p className="text-white/20 text-xs mt-3 font-kiona">ID: {ga4Id}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-white/10 bg-white/[0.01] p-8 text-center">
          <h3 className="text-[10px] font-kiona tracking-widest uppercase text-[#D4AF37] mb-3">Top Performing Content</h3>
          <p className="text-sm text-white/40 italic">
            {isConnected ? 'Connect GA4 Reporting API to pull data here.' : 'Connect GA4 to enable.'}
          </p>
        </div>
        <div className="border border-white/10 bg-white/[0.01] p-8 text-center">
          <h3 className="text-[10px] font-kiona tracking-widest uppercase text-[#D4AF37] mb-3">Traffic Over Time</h3>
          <p className="text-sm text-white/40 italic">
            {isConnected ? 'GA4 Reporting API integration pending.' : 'Connect GA4 to enable.'}
          </p>
        </div>
      </div>
    </div>
  );
}

function injectGA4(measurementId: string) {
  if (!measurementId || document.getElementById('ga4-script')) return;
  const script1 = document.createElement('script');
  script1.id = 'ga4-script';
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.id = 'ga4-init';
  script2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}');
  `;
  document.head.appendChild(script2);
}
