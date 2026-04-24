import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, ReactNode, useState } from "react";
import {
  DollarSign,
  Calendar,
  BarChart2,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  Star,
  ChevronDown,
  Phone,
  FileText,
  Users,
  ShieldCheck,
  Target,
  PieChart,
  Link as LinkIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

// ─── RevealLine ────────────────────────────────────────────────────────────────
function RevealLine({
  children,
  isSpace = false,
}: {
  children?: ReactNode;
  isSpace?: boolean;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress = 1 - rect.top / windowHeight;
      let opacity = 0.15;
      if (progress >= 0.2 && progress <= 0.8) {
        if (progress < 0.35) {
          opacity = 0.15 + ((progress - 0.2) / 0.15) * 0.85;
        } else if (progress < 0.65) {
          opacity = 1;
        } else {
          opacity = 1 - ((progress - 0.65) / 0.15) * 0.85;
        }
      }
      el.style.opacity = Math.max(0.15, Math.min(1, opacity)).toString();
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isSpace)
    return <div className="h-8 sm:h-12 w-full" aria-hidden="true" />;

  return (
    <p
      ref={ref}
      style={{ opacity: 0.15, transition: "opacity 0.1s ease-out", willChange: "opacity" }}
      className="text-white text-[26px] sm:text-[30px] font-medium leading-[1.25] tracking-tight text-center mx-auto max-w-5xl"
    >
      {children}
    </p>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative w-full flex flex-col items-center justify-start pt-32 sm:pt-40 md:pt-48 min-h-[90vh] px-6 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 65% 55% at 50% 60%, rgba(212,175,55,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-kiona text-[9px] sm:text-[10px] text-white tracking-[0.3em] mb-8 block uppercase"
        >
          Strategic Financial Guidance
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-[2.2rem] sm:text-[3.2rem] md:text-[4rem] lg:text-[4.5rem] font-medium text-white leading-[1.0] tracking-tight mb-6"
        >
          Your Business Deserves<br />
          a Financial Strategy,{" "}
          <span className="text-white/40">Not Just a Spreadsheet.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="text-white/55 text-lg sm:text-xl max-w-2xl leading-relaxed mb-4"
        >
          Most business owners are so busy running the day-to-day that they
          never step back to look at the bigger picture. Ryan Kroge brings 25
          years of financial expertise to help you understand where your money
          is going, where it should be going, and how to get there.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="font-kiona text-[8px] sm:text-[9px] text-white/30 tracking-[0.2em] uppercase mb-10"
        >
          No jargon. No guesswork. Just clear, actionable financial guidance built around your goals.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center"
        >
          <a
            href="https://ryankroge.com/contact/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 bg-[#D4AF37] text-black px-8 py-4 text-[11px] font-bold font-kiona tracking-widest uppercase transition-colors duration-300 hover:bg-white hover:text-black whitespace-nowrap"
          >
            Apply
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
          </a>
          <a
            href="#process"
            className="group inline-flex items-center justify-center gap-3 text-white/70 hover:text-white text-[11px] font-kiona tracking-widest uppercase transition-colors duration-300 whitespace-nowrap py-2"
          >
            BOOK A CALL
          </a>
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
}

// ─── Reality Check ─────────────────────────────────────────────────────────────
const BLIND_SPOTS = [
  "Whether your cash flow can support growth in the next 12 months?",
  "Where your biggest financial leaks are hiding?",
  "If your pricing model is actually profitable after expenses?",
  "Whether you're positioned to get approved for financing when you need it?",
];

function RealityCheckSection() {
  return (
    <section className="relative w-full bg-black px-6 py-20 sm:py-28 lg:py-36 flex flex-col items-center justify-center border-t border-white/[0.04]">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="font-kiona text-[9px] sm:text-[10px] text-white tracking-[0.25em] font-medium mb-12 sm:mb-16 uppercase text-center"
      >
        THE REALITY
      </motion.span>

      <div className="w-full flex flex-col items-center space-y-2 sm:space-y-4 mb-16 sm:mb-20">
        <RevealLine>Most businesses are flying blind financially.</RevealLine>

        <RevealLine isSpace />

        <RevealLine>You're generating revenue —</RevealLine>
        <RevealLine>maybe even good revenue.</RevealLine>
        <RevealLine>But do you actually know...</RevealLine>
      </div>

      {/* Blind spot questions card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true, amount: 0.3 }}
        className="w-full max-w-2xl bg-[#0a0a0a]/60 backdrop-blur-lg border border-white/[0.08] p-8 sm:p-10 relative overflow-hidden mb-16 sm:mb-20"
      >
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/[0.02] to-transparent pointer-events-none" />
        <ul className="flex flex-col gap-5">
          {BLIND_SPOTS.map((q, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="font-kiona text-[#D4AF37] text-[9px] tracking-widest mt-1 flex-shrink-0">
                0{i + 1}
              </span>
              <span className="text-white/65 text-base sm:text-lg leading-snug">{q}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      <div className="w-full flex flex-col items-center space-y-2 sm:space-y-4">
        <RevealLine>If any of those made you pause,</RevealLine>
        <RevealLine>you're not alone.</RevealLine>

        <RevealLine isSpace />

        <RevealLine>Most small business owners are reactive</RevealLine>
        <RevealLine>with their finances.</RevealLine>
        <RevealLine>
          <span className="font-normal opacity-50">Strategic financial guidance flips that —</span>
        </RevealLine>
        <RevealLine>
          <span className="font-normal opacity-50">so you're always a step ahead.</span>
        </RevealLine>
      </div>
    </section>
  );
}

// ─── Who This Is For ───────────────────────────────────────────────────────────
const PERSONAS = [
  {
    Icon: TrendingUp,
    tag: "The Growth-Stage Owner",
    title: "Revenue Is In. Clarity Isn't.",
    desc: "You've survived the startup phase. Revenue is coming in, but you feel like you're always scrambling. You need a clear financial roadmap that tells you when to hire, when to invest, and when to hold back.",
  },
  {
    Icon: Target,
    tag: "Preparing for a Major Move",
    title: "Your Financials Need to Tell a Story.",
    desc: "Whether you're taking out a loan, acquiring a business, bringing on a partner, or planning to sell — your financials need to be compelling. Ryan helps you get them there.",
  },
  {
    Icon: ShieldCheck,
    tag: "The Owner Who's Been Burned",
    title: "You Need Someone Who Looks Forward.",
    desc: "Maybe you've had an accountant who just filed taxes or a bookkeeper who only looked backward. You need someone who helps you make smarter decisions before they become expensive mistakes.",
  },
];

function WhoThisIsForSection() {
  return (
    <section className="relative w-full bg-black py-24 sm:py-32 px-6 sm:px-10 lg:px-24 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 sm:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-kiona text-[9px] sm:text-[10px] text-white tracking-[0.25em] font-medium mb-6 block uppercase"
          >
            WHO THIS IS FOR
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-medium text-white leading-[1.05] tracking-tight"
          >
            This Is for Business Owners<br className="hidden sm:block" />{" "}
            Who Are Ready to Think Bigger.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {PERSONAS.map(({ Icon, tag, title, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              viewport={{ once: true, amount: 0.2 }}
              className="bg-[#0a0a0a]/60 backdrop-blur-lg border border-white/[0.08] p-8 sm:p-10 flex flex-col gap-5 relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
              <div className="flex items-center gap-3">
                <Icon className="w-6 h-6 text-[#D4AF37]" strokeWidth={1.5} />
                <span className="font-kiona text-[8px] text-[#D4AF37] tracking-[0.2em] uppercase">
                  {tag}
                </span>
              </div>
              <div>
                <h3 className="text-white text-xl sm:text-2xl font-medium mb-3 tracking-tight leading-snug">
                  {title}
                </h3>
                <p className="text-white/50 text-base leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── What Ryan Does ────────────────────────────────────────────────────────────
const SERVICES = [
  {
    num: "01.",
    Icon: DollarSign,
    title: "Cash Flow Management",
    desc: "We map out where your money comes in and where it goes out — then build a forecasting model so you're never caught off guard. No more end-of-month surprises.",
  },
  {
    num: "02.",
    Icon: Calendar,
    title: "Budgeting & Financial Forecasting",
    desc: "Ryan builds forward-looking budgets tied to your real business goals — not just last year's numbers. You'll see projected performance 3, 6, and 12 months out.",
  },
  {
    num: "03.",
    Icon: PieChart,
    title: "Profitability Analysis",
    desc: "Not all revenue is equal. Ryan helps you identify which products, services, or clients are actually driving profit — and which ones are quietly draining it.",
  },
  {
    num: "04.",
    Icon: BarChart2,
    title: "Loan Readiness & Financial Positioning",
    desc: "If SBA financing or outside capital is in your future, your financials need to be clean and positioned to impress a lender. Ryan knows exactly what banks look for — because he's worked with them for 25 years.",
  },
  {
    num: "05.",
    Icon: Target,
    title: "Growth Strategy Advisory",
    desc: "Beyond the numbers, Ryan connects financial data to strategic decisions — expansion, hiring, equipment, new markets. He helps you think through the financial impact before you commit.",
  },
];

function WhatRyanDoesSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="relative w-full bg-black border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 lg:px-24 flex flex-col md:flex-row items-start relative gap-12 lg:gap-24">

        {/* Left Sticky */}
        <div className="md:w-[40%] md:sticky md:top-0 md:h-screen flex flex-col justify-center pt-20 pb-10 md:pt-0 md:pb-0 z-10 self-start shrink-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <h3 className="font-kiona text-[9px] sm:text-[10px] text-white tracking-[0.25em] font-medium mb-6 sm:mb-8 uppercase">
              WHAT RYAN DOES
            </h3>
            <h2 className="text-3xl sm:text-4xl md:text-[2.6rem] font-medium tracking-tight text-white leading-[1.05] max-w-sm mb-10">
              Here's What Ryan Actually{" "}
              <span className="text-white/35">Does For You.</span>
            </h2>

            {/* Service nav pills */}
            <div className="flex flex-col gap-3 min-w-[280px]">
              {SERVICES.map(({ num, Icon, title }, i) => {
                const isActive = activeTab === i;
                return (
                  <div
                    key={i}
                    onClick={() => {
                      const el = document.getElementById(`what-ryan-does-card-${i}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className={`group bg-[#0a0a0a]/60 backdrop-blur-lg border transition-all duration-300 px-5 py-3 flex items-center gap-4 relative overflow-hidden cursor-pointer ${isActive ? 'border-white/[0.25]' : 'border-white/[0.08] hover:border-white/[0.25]'}`}
                  >
                    <div className={`absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent to-transparent transition-all duration-300 ${isActive ? 'via-white/[0.3]' : 'via-white/[0.1] group-hover:via-white/[0.3]'}`} />
                    <div className={`absolute inset-0 bg-white/[0.02] transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                    <span className={`transition-transform duration-300 font-kiona text-[9px] tracking-widest ${isActive ? 'text-[#D4AF37] scale-110' : 'text-[#D4AF37] group-hover:scale-110'}`}>{num}</span>
                    <span className={`transition-colors duration-300 text-sm font-medium tracking-wide flex-1 truncate ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>{title}</span>
                    <Icon className={`w-4 h-4 transition-colors duration-300 flex-shrink-0 ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white'}`} strokeWidth={1.5} />
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right Scrolling */}
        <div className="flex-1 flex flex-col pb-24 md:py-32 relative z-0">
          {SERVICES.map((svc, idx) => {
            const Icon = svc.Icon;
            return (
              <motion.div
                id={`what-ryan-does-card-${idx}`}
                key={idx}
                initial={{ opacity: 0.15, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                onViewportEnter={() => setActiveTab(idx)}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ amount: 0.4, margin: "-20% 0px -40% 0px" }}
                className="flex flex-col justify-center min-h-[40vh] md:min-h-[80vh] border-b border-white/[0.05] last:border-b-0 py-12 md:py-0"
              >
                <div className="flex items-center gap-4 mb-5">
                  <span className="font-kiona text-[#D4AF37] text-sm tracking-[0.2em] font-medium">
                    {svc.num}
                  </span>
                  <Icon className="w-5 h-5 text-[#D4AF37]" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl text-white font-medium mb-4 md:mb-6 leading-snug">
                  {svc.title}
                </h3>
                <p className="text-lg sm:text-xl text-white/50 leading-[1.5] max-w-xl">
                  {svc.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── The Ryan Difference ───────────────────────────────────────────────────────
const CREDENTIALS = [
  "25 years of hands-on banking and business finance experience",
  "A track record closing complex, multi-million dollar deals nationwide",
  "Deep knowledge of SBA lending, business acquisitions, and growth financing",
  "A communication style that makes the numbers actually make sense",
];

function RyanDifferenceSection() {
  return (
    <section className="relative w-full bg-black py-24 sm:py-32 px-6 sm:px-10 lg:px-24 border-t border-white/[0.04]">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 55% 45% at 70% 50%, rgba(212,175,55,0.06) 0%, transparent 65%)",
        }}
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start relative z-10">

        {/* Left: Headline + credentials */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <span className="font-kiona text-[9px] sm:text-[10px] text-white tracking-[0.25em] font-medium mb-8 block uppercase">
            THE RYAN DIFFERENCE
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-white leading-[1.05] tracking-tight mb-10">
            This Isn't Generic Financial Advice.{" "}
            <span className="text-white/35">It's Built Around Your Business.</span>
          </h2>
          <p className="text-white/50 text-lg leading-relaxed mb-10">
            There's no shortage of financial advice online. What's rare is
            someone who combines deep banking experience with genuine care for
            your outcome — and translates financial data into decisions you can
            actually act on today.
          </p>
          <ul className="flex flex-col gap-4">
            {CREDENTIALS.map((cred, i) => (
              <li key={i} className="flex items-start gap-4">
                <CheckCircle
                  className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5"
                  strokeWidth={1.5}
                />
                <span className="text-white/65 text-base leading-snug">{cred}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Right: Stats + quote */}
        <div className="flex flex-col gap-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "25+", label: "Years of Experience" },
              { value: "$5M+", label: "Complex Deals Closed" },
              { value: "24hr", label: "Response Guarantee" },
              { value: "100%", label: "Client-Focused" },
            ].map(({ value, label }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-[#0a0a0a]/60 backdrop-blur-lg border border-white/[0.08] p-6 sm:p-8 flex flex-col gap-2 relative overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
                <span className="text-[#D4AF37] text-2xl sm:text-3xl font-medium tracking-tight">
                  {value}
                </span>
                <span className="text-white/50 text-sm font-light">{label}</span>
              </motion.div>
            ))}
          </div>

          {/* Pull quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
            className="bg-[#0a0a0a]/60 backdrop-blur-lg border border-white/[0.08] p-8 sm:p-10 relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/[0.02] to-transparent pointer-events-none" />
            <Star className="w-5 h-5 text-[#D4AF37] mb-6" strokeWidth={1.5} />
            <p className="text-white/80 text-xl sm:text-2xl font-medium leading-snug tracking-tight mb-6 italic">
              "Extremely knowledgeable and passionate, Ryan is on top of his game!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-6 h-[1px] bg-[#D4AF37]/40" />
              <div>
                <p className="text-white text-sm font-medium">Brandon Shaya</p>
                <p className="text-white/40 text-xs">Business Owner</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── The Process ───────────────────────────────────────────────────────────────
const STEPS = [
  {
    num: "01",
    tag: "STEP 1",
    badge: "Free",
    title: "Discovery Call",
    desc: "We start with a 30-minute conversation about your business, your goals, and your current financial situation. No pitch. Just listening.",
    Icon: Phone,
  },
  {
    num: "02",
    tag: "STEP 2",
    badge: null,
    title: "Financial Assessment",
    desc: "Ryan reviews your current financials — P&L, cash flow statements, balance sheet — and identifies gaps, risks, and opportunities you may not be seeing.",
    Icon: FileText,
  },
  {
    num: "03",
    tag: "STEP 3",
    badge: null,
    title: "Strategy Build",
    desc: "Together, we build a forward-looking financial plan customized to your business stage and goals — cash flow projections, budget targets, and a prioritized action list.",
    Icon: BarChart2,
  },
  {
    num: "04",
    tag: "STEP 4",
    badge: "Optional",
    title: "Ongoing Advisory",
    desc: "For business owners who want a continued sounding board, Ryan offers ongoing advisory support — monthly check-ins, financial reviews, and real-time guidance as your business evolves.",
    Icon: Users,
  },
];

function ProcessSection() {
  return (
    <section id="process" className="relative w-full bg-black py-24 sm:py-32 px-6 sm:px-10 lg:px-24 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 sm:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-kiona text-[9px] sm:text-[10px] text-white tracking-[0.25em] font-medium mb-6 block uppercase"
          >
            THE PROCESS
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-medium text-white leading-[1.05] tracking-tight mb-6"
          >
            What to Expect When<br className="hidden sm:block" /> You Work With Ryan
          </motion.h2>
        </div>

        {/* 2×2 grid on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {STEPS.map(({ num, tag, badge, title, desc, Icon }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              viewport={{ once: true, amount: 0.2 }}
              className="bg-[#0a0a0a]/60 backdrop-blur-lg border border-white/[0.08] p-8 sm:p-10 flex flex-col gap-6 relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-[#D4AF37]/35 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#D4AF37]" strokeWidth={1.5} />
                  </div>
                  <span className="font-kiona text-[8px] sm:text-[9px] text-[#D4AF37] tracking-[0.25em] uppercase">
                    {tag}
                  </span>
                </div>
                {badge && (
                  <span className="font-kiona text-[7px] text-white/30 tracking-[0.2em] border border-white/10 px-3 py-1 uppercase">
                    {badge}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-white text-xl sm:text-2xl font-medium mb-3 tracking-tight leading-snug">
                  {title}
                </h3>
                <p className="text-white/50 text-base leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Social Proof ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote:
      "Ryan helped us see that we were underpricing two of our core services. One pricing adjustment added $80K to our annual revenue without a single new client.",
    author: "Service Business Owner",
    industry: "Midwest",
  },
  {
    quote:
      "We were preparing to apply for an SBA loan and our financials were a mess. Ryan spent two months helping us clean everything up. We got approved — and at a better rate than expected.",
    author: "Restaurant Group Owner",
    industry: "Multi-location",
  },
  {
    quote:
      "I finally feel like I understand my own business finances. Ryan explained everything in plain English and built us a 12-month cash flow model we actually use every week.",
    author: "E-commerce Founder",
    industry: "DTC Brand",
  },
];

function SocialProofSection() {
  return (
    <section className="relative w-full bg-black py-24 sm:py-32 px-6 sm:px-10 lg:px-24 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 sm:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-kiona text-[9px] sm:text-[10px] text-white tracking-[0.25em] font-medium mb-6 block uppercase"
          >
            RESULTS
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-medium text-white leading-[1.05] tracking-tight"
          >
            Real Businesses. Real Outcomes.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {TESTIMONIALS.map(({ quote, author, industry }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              viewport={{ once: true, amount: 0.2 }}
              className="bg-[#0a0a0a]/60 backdrop-blur-lg border border-white/[0.08] p-8 sm:p-10 flex flex-col gap-6 relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/[0.02] to-transparent pointer-events-none" />
              <Star className="w-5 h-5 text-[#D4AF37]" strokeWidth={1.5} />
              <p className="text-white/80 text-base sm:text-lg font-medium leading-snug italic flex-grow">
                "{quote}"
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-6 h-[1px] bg-[#D4AF37]/40" />
                <div>
                  <p className="text-white text-sm font-medium">{author}</p>
                  <p className="text-white/40 text-xs">{industry}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ───────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Is this the same as hiring an accountant or bookkeeper?",
    a: "No. An accountant looks backward — taxes, compliance, filing. Ryan looks forward — strategy, forecasting, growth planning. Think of it as the difference between a historian and a navigator.",
  },
  {
    q: "Do I need to be a certain size to benefit from this?",
    a: "Not at all. Whether you're doing $200K or $5M in revenue, strategic financial guidance helps you make better decisions at every stage.",
  },
  {
    q: "What if my financials are a mess right now?",
    a: "That's actually the most common starting point. Ryan has worked with businesses in all stages of financial organization. You don't need to have it all figured out — that's what this is for.",
  },
  {
    q: "How is this different from what my bank offers?",
    a: "Banks look at your financials to make decisions about you. Ryan looks at your financials to make decisions with you. The perspective is completely different.",
  },
  {
    q: "Does Ryan also help with SBA loans and business acquisitions?",
    a: "Yes. Financial guidance often ties directly into loan readiness or acquisition preparation. Ryan can seamlessly connect all three services depending on where you are in your journey.",
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative w-full bg-black py-24 sm:py-32 px-6 sm:px-10 lg:px-24 border-t border-white/[0.04]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16 sm:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-kiona text-[9px] sm:text-[10px] text-white tracking-[0.25em] font-medium mb-6 block uppercase"
          >
            FAQ
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-medium text-white leading-[1.05] tracking-tight"
          >
            Questions People<br className="hidden sm:block" /> Usually Ask First
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="bg-[#0a0a0a]/60 backdrop-blur-lg border border-white/[0.08] px-8 sm:px-10 relative overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
          {FAQS.map(({ q, a }, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="border-b border-white/[0.06] last:border-b-0">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                >
                  <span className="text-white text-base sm:text-lg font-medium leading-snug tracking-tight group-hover:text-white/80 transition-colors">
                    {q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-[#D4AF37]" strokeWidth={1.5} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-white/50 text-base leading-relaxed pb-6 max-w-2xl">
                        {a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Final CTA ─────────────────────────────────────────────────────────────────
function FinalCTASection() {
  return (
    <section className="relative w-full bg-black py-24 sm:py-32 px-6 sm:px-10 lg:px-24 border-t border-white/[0.04]">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="relative p-[1px] overflow-hidden group">
          {/* Default ambient border */}
          <div className="absolute inset-0 border border-white/[0.08]" />

          {/* Animated Traveling Gradient */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] aspect-square z-0 opacity-70"
            style={{
              background: "conic-gradient(from 0deg, transparent 0 300deg, #D4AF37 360deg)",
            }}
          />

          <div className="relative z-10 w-full h-full bg-[#0a0a0a]/60 backdrop-blur-lg p-10 sm:p-16">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/25 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/[0.03] to-transparent pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              {/* Left */}
              <div>
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="font-kiona text-[9px] sm:text-[10px] text-[#D4AF37] tracking-[0.25em] font-medium mb-6 block uppercase"
                >
                  GET STARTED
                </motion.span>
                <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="text-3xl sm:text-4xl md:text-[2.75rem] font-medium text-white leading-[1.05] tracking-tight mb-6"
                >
                  Stop Reacting to Your Finances. Start Leading With Them.
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-white/50 text-base sm:text-lg leading-relaxed"
                >
                  The most successful business owners aren't necessarily the ones
                  who work the hardest — they're the ones who make the smartest
                  financial decisions. That clarity starts with one conversation.
                </motion.p>
              </div>

              {/* Right */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col items-start md:items-center gap-5 md:gap-8"
              >
                <a
                  href="https://ryankroge.com/contact/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-full md:w-auto inline-flex items-center justify-center gap-3 bg-[#D4AF37] text-black px-10 py-4 text-[11px] font-bold font-kiona tracking-widest uppercase transition-colors duration-300 hover:bg-white hover:text-black"
                >
                  Apply
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
                </a>

                <p className="text-white/25 text-xs tracking-wide text-center">
                  No cost. No commitment. Just a real conversation about your financial future.
                </p>

                {/* Cross-links */}
                <div className="flex items-center gap-4 pt-2">
                  <Link
                    to="/sba-loans"
                    className="font-kiona text-[8px] text-white/35 hover:text-white/70 tracking-[0.2em] uppercase transition-colors"
                  >
                    SBA Loans
                  </Link>
                  <span className="text-white/10">|</span>
                  <Link
                    to="/business-acquisition"
                    className="font-kiona text-[8px] text-white/35 hover:text-white/70 tracking-[0.2em] uppercase transition-colors"
                  >
                    Business Acquisition
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main Export ───────────────────────────────────────────────────────────────
export default function StrategicFinancialGuidance() {
  return (
    <div className="relative bg-black min-h-screen">
      <HeroSection />
      <RealityCheckSection />
      <WhoThisIsForSection />
      <WhatRyanDoesSection />
      <RyanDifferenceSection />
      <ProcessSection />
      <SocialProofSection />
      <FAQSection />
      <FinalCTASection />
    </div>
  );
}
