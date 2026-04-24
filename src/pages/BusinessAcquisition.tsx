import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, ReactNode, useState } from "react";
import ryan80 from "../../photos/Ryan Kroge pics/Ryan_Kroge-80.jpg";
import {
  Building2,
  TrendingUp,
  DollarSign,
  Clock,
  BarChart2,
  CheckCircle,
  Star,
  ArrowRight,
  ChevronDown,
  Users,
  Search,
  ShieldCheck,
  Percent,
} from "lucide-react";

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
  const { scrollY } = useScroll();
  const imageScale = useTransform(scrollY, [0, 400], [0.85, 1.05]);

  return (
    <section className="relative w-full flex flex-col justify-start pt-32 sm:pt-40 md:pt-48 min-h-[90vh] overflow-hidden">
      {/* Dual gold radial glows */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 30% 70%, rgba(212,175,55,0.07) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 70% 40%, rgba(212,175,55,0.05) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center w-full px-6 max-w-5xl mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-kiona text-[9px] sm:text-[10px] text-white tracking-[0.3em] mb-8 block uppercase"
        >
          Business Acquisition
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-[2.2rem] sm:text-[3.2rem] md:text-[4rem] lg:text-[4.5rem] font-medium text-white leading-[1.0] tracking-tight mb-8"
        >
          You Built Something Real.<br />
          <span className="text-white/40">Let's Make Sure the Next</span><br />
          <span className="text-white/40">Chapter Reflects That.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-white/55 text-lg sm:text-xl max-w-2xl leading-relaxed mb-12"
        >
          Whether you're ready to exit on your terms or acquire a business
          that's already generating cash — Ryan Kroge helps you move with
          confidence, clarity, and the right financing behind you.
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
            href="https://ryankroge.com/contact/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-3 text-white/70 hover:text-white text-[11px] font-kiona tracking-widest uppercase transition-colors duration-300 whitespace-nowrap py-2"
          >
            BOOK A CALL
          </a>
        </motion.div>
      </div>

      {/* Faded Image Under Buttons */}
      <motion.div
        className="relative w-full max-w-6xl px-6 mx-auto mt-16 sm:mt-20 lg:mt-24 h-[55vh] sm:h-[65vh] lg:h-[75vh] z-0 overflow-hidden pointer-events-none mt-auto origin-bottom"
        style={{ scale: imageScale }}
      >
        <motion.img
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          src={ryan80}
          alt="Ryan Kroge"
          className="w-full h-full object-contain object-bottom grayscale opacity-90"
        />
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
}

// ─── Quick Stats Strip ─────────────────────────────────────────────────────────
const QUICK_STATS = [
  { Icon: Percent, label: "As Little as 10% Down" },
  { Icon: Clock, label: "Most Deals Close in 60–120 Days" },
  { Icon: DollarSign, label: "SBA Financing Up to $5M" },
  { Icon: ShieldCheck, label: "Free Initial Consultation" },
];

function QuickStatsStrip() {
  return (
    <section className="relative w-full border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-24 py-10 sm:py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {QUICK_STATS.map(({ Icon, label }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-[#0a0a0a]/60 backdrop-blur-lg border border-white/[0.08] p-6 sm:p-8 flex flex-col items-center gap-4 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
              <Icon className="w-6 h-6 text-[#D4AF37]" strokeWidth={1.5} />
              <span className="text-white text-sm sm:text-base font-medium tracking-tight">
                {label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Problem Section ───────────────────────────────────────────────────────────
function ProblemSection() {
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

      <div className="w-full flex flex-col items-center space-y-2 sm:space-y-4">
        <RevealLine>Most people leave money on the table —</RevealLine>
        <RevealLine>or never get started at all.</RevealLine>

        <RevealLine isSpace />

        <RevealLine>Business owners spend years building</RevealLine>
        <RevealLine>something valuable, then either sell</RevealLine>
        <RevealLine>too fast and undervalue what they built —</RevealLine>

        <RevealLine isSpace />

        <RevealLine>or buyers sit on the sidelines thinking</RevealLine>
        <RevealLine>they need 100% cash upfront.</RevealLine>

        <RevealLine isSpace />

        <RevealLine>
          <span className="font-normal opacity-50">SBA financing lets qualified buyers</span>
        </RevealLine>
        <RevealLine>
          <span className="font-normal opacity-50">acquire businesses with as little as 10% down.</span>
        </RevealLine>
        <RevealLine>
          <span className="font-normal opacity-50">Most people have never even heard of it.</span>
        </RevealLine>
      </div>
    </section>
  );
}

// ─── Who This Is For ───────────────────────────────────────────────────────────
function WhoThisIsForSection() {
  return (
    <section className="relative w-full bg-black py-24 sm:py-32 px-6 sm:px-10 lg:px-24 border-t border-white/[0.04]">
      <div className="max-w-5xl mx-auto">
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
            This Is Built for Two Types of People
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* The Seller */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
            className="bg-[#0a0a0a]/60 backdrop-blur-lg border border-white/[0.08] p-8 sm:p-10 flex flex-col gap-6 relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            <div className="flex items-center gap-4">
              <Building2 className="w-7 h-7 text-white" strokeWidth={1.5} />
              <span className="font-kiona text-[9px] text-white tracking-[0.25em] uppercase">
                The Seller
              </span>
            </div>
            <div>
              <h3 className="text-white text-2xl sm:text-3xl font-medium mb-4 tracking-tight leading-snug">
                Exit on Your Terms
              </h3>
              <p className="text-white/55 text-base sm:text-lg leading-relaxed">
                You've owned your business for years. Maybe you're ready to
                retire, pursue something new, or just cash out while the market
                is right. You want a smooth process, a fair valuation, and a
                buyer who won't waste your time.
              </p>
            </div>
          </motion.div>

          {/* The Buyer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, amount: 0.2 }}
            className="bg-[#0a0a0a]/60 backdrop-blur-lg border border-white/[0.08] p-8 sm:p-10 flex flex-col gap-6 relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            <div className="flex items-center gap-4">
              <TrendingUp className="w-7 h-7 text-white" strokeWidth={1.5} />
              <span className="font-kiona text-[9px] text-white tracking-[0.25em] uppercase">
                The Buyer
              </span>
            </div>
            <div>
              <h3 className="text-white text-2xl sm:text-3xl font-medium mb-4 tracking-tight leading-snug">
                Skip the Build. Buy the Proof.
              </h3>
              <p className="text-white/55 text-base sm:text-lg leading-relaxed">
                You're tired of building from scratch. You want a business that
                already has customers, cash flow, and a team. You're driven,
                smart, and ready to grow something — you just need the right
                deal and the right guidance.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── How Ryan Helps ────────────────────────────────────────────────────────────
const SELLER_SERVICES = [
  { Icon: BarChart2, text: "Full business valuation so you know exactly what you have" },
  { Icon: Search, text: "Identifying and vetting serious, qualified buyers" },
  { Icon: ShieldCheck, text: "Negotiating deal terms that protect your interests" },
  { Icon: Clock, text: "Managing the timeline so nothing falls through the cracks" },
];

const BUYER_SERVICES = [
  { Icon: BarChart2, text: "Evaluating financials so you know what you're really buying" },
  { Icon: CheckCircle, text: "Structuring offers that stand out and get accepted" },
  { Icon: DollarSign, text: "Navigating SBA loan requirements from start to approval" },
  { Icon: TrendingUp, text: "Closing deals — without the chaos" },
];

const HOW_RYAN_CARDS = [
  {
    num: "01.",
    audience: "FOR SELLERS",
    title: "Get the Valuation You Deserve.",
    desc: "Ryan provides a full business valuation, identifies and vets serious buyers, negotiates terms that protect your interests, and manages the timeline from first conversation to closing day.",
    services: SELLER_SERVICES,
  },
  {
    num: "02.",
    audience: "FOR BUYERS",
    title: "Acquire With Confidence.",
    desc: "Ryan digs into the financials so you know exactly what you're purchasing, structures your offer to stand out, guides you through every SBA requirement, and closes the deal without the chaos.",
    services: BUYER_SERVICES,
  },
  {
    num: "03.",
    audience: "FOR BOTH",
    title: "One Expert. Both Sides.",
    desc: "25+ years in banking and SBA financing means Ryan has sat on every side of this table. He knows how lenders think, what buyers overlook, and what sellers underestimate. That knowledge is in the room with you from day one.",
    services: [],
  },
];

function HowRyanHelpsSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="relative w-full bg-black border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 lg:px-24 flex flex-col md:flex-row items-start relative gap-12 lg:gap-24">

        {/* Left Sticky Panel */}
        <div className="md:w-[35%] lg:w-[40%] md:sticky md:top-0 md:h-screen flex flex-col justify-center pt-20 pb-10 md:pt-0 md:pb-0 z-10 self-start shrink-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <h3 className="font-kiona text-[9px] sm:text-[10px] text-white tracking-[0.25em] font-medium mb-6 sm:mb-8 uppercase">
              HOW RYAN HELPS
            </h3>
            <h2 className="text-3xl sm:text-4xl md:text-[2.6rem] font-medium tracking-tight text-white leading-[1.05] max-w-sm mb-10">
              Here's What Working With Ryan{" "}
              <span className="text-white/35">Actually Looks Like.</span>
            </h2>

            {/* Audience pill badges */}
            <div className="flex flex-col gap-3">
              {[
                { label: "Sellers", Icon: Building2 },
                { label: "Buyers", Icon: TrendingUp },
                { label: "Both", Icon: Users },
              ].map(({ label, Icon }, i) => {
                const isActive = activeTab === i;
                return (
                  <div
                    key={i}
                    onClick={() => {
                      const el = document.getElementById(`ryan-helps-card-${i}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className={`group bg-[#0a0a0a]/60 backdrop-blur-lg border transition-all duration-300 px-5 py-3 flex items-center gap-4 relative overflow-hidden cursor-pointer ${isActive ? 'border-white/[0.25]' : 'border-white/[0.08] hover:border-white/[0.25]'}`}
                  >
                    <div className={`absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent to-transparent transition-all duration-300 ${isActive ? 'via-white/[0.3]' : 'via-white/[0.1] group-hover:via-white/[0.3]'}`} />
                    <div className={`absolute inset-0 bg-white/[0.02] transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                    <Icon className={`w-4 h-4 text-[#D4AF37] transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} strokeWidth={1.5} />
                    <span className={`transition-colors duration-300 text-sm font-medium tracking-wide ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>{label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right Scrolling Panel */}
        <div className="flex-1 flex flex-col pb-24 md:py-32 relative z-0">
          {HOW_RYAN_CARDS.map((card, idx) => (
            <motion.div
              id={`ryan-helps-card-${idx}`}
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
                  {card.num}
                </span>
                <span className="font-kiona text-[8px] text-white/30 tracking-[0.25em] uppercase">
                  {card.audience}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl text-white font-medium mb-4 md:mb-6 leading-snug">
                {card.title}
              </h3>
              <p className="text-lg sm:text-xl text-white/50 leading-[1.5] max-w-xl mb-8">
                {card.desc}
              </p>
              {card.services.length > 0 && (
                <ul className="flex flex-col gap-3 max-w-xl">
                  {card.services.map(({ Icon, text }, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <Icon
                        className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-1"
                        strokeWidth={1.5}
                      />
                      <span className="text-white/55 text-base leading-snug">
                        {text}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SBA Financing Breakdown ───────────────────────────────────────────────────
function SBAFinancingSection() {
  return (
    <section className="relative w-full bg-black py-24 sm:py-32 px-6 sm:px-10 lg:px-24 border-t border-white/[0.04]">
      {/* Subtle glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 65% 50% at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 70%)",
        }}
      />
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16 sm:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-kiona text-[9px] sm:text-[10px] text-white tracking-[0.25em] font-medium mb-6 block uppercase"
          >
            SBA FINANCING
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-medium text-white leading-[1.05] tracking-tight mb-6"
          >
            Why SBA Financing Changes Everything
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-white/50 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Most people assume buying a business means having millions in the
            bank. It doesn't.
          </motion.p>
        </div>

        {/* 3 stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {[
            { value: "10%", label: "Minimum Down Payment", desc: "Put down as little as 10% of the purchase price with an SBA 7(a) loan" },
            { value: "10yr", label: "Repayment Term", desc: "Finance the rest over 10 years at competitive, fixed rates" },
            { value: "Self-pay", label: "The Business Pays for Itself", desc: "Use the business's own cash flow to service the debt from day one" },
          ].map(({ value, label, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              viewport={{ once: true, amount: 0.3 }}
              className="bg-[#0a0a0a]/60 backdrop-blur-lg border border-white/[0.08] p-8 flex flex-col gap-3 relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
              <span className="text-[#D4AF37] text-3xl sm:text-4xl font-medium tracking-tight">
                {value}
              </span>
              <h3 className="text-white text-base font-medium tracking-tight">{label}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Example callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative p-[1px] overflow-hidden group mt-10"
        >
          {/* Default ambient border */}
          <div className="absolute inset-0 border border-white/[0.08]" />

          {/* Animated Traveling Gradient - clean line flow */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] aspect-square z-0"
            style={{
              background: "conic-gradient(from 0deg, transparent 0 340deg, #D4AF37 360deg)",
            }}
          />

          <div className="relative z-10 w-full h-full bg-[#0a0a0a] p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
            <div className="flex-shrink-0">
              <p className="font-kiona text-[9px] text-[#D4AF37] tracking-[0.25em] uppercase mb-3">
                Real Example
              </p>
              <p className="text-white text-4xl sm:text-5xl font-medium tracking-tight">
                $50K
              </p>
              <p className="text-white/40 text-sm mt-1">Down</p>
            </div>
            <div className="w-px h-16 bg-white/[0.06] hidden sm:block flex-shrink-0" />
            <div>
              <p className="text-white text-xl sm:text-2xl font-medium mb-3 leading-snug">
                A $500,000 business. Acquired for $50,000 down.
              </p>
              <p className="text-white/50 text-base leading-relaxed">
                The business pays for itself from day one. This is one of the
                most powerful — and underused — tools in business ownership.
              </p>
            </div>
           </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Testimonials ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote:
      "Ryan helped us close a $1.2M acquisition in under 90 days. The SBA process felt overwhelming until he broke it down step by step.",
    author: "Buyer",
    industry: "Service Industry",
  },
  {
    quote:
      "I didn't think I'd get fair market value. Ryan found the right buyer and handled everything.",
    author: "Seller",
    industry: "Regional Retail Business",
  },
  {
    quote:
      "I had no idea I could buy a business with 10% down. Ryan walked me through every step and we closed in less than 4 months.",
    author: "First-Time Buyer",
    industry: "Food & Beverage",
  },
];

function TestimonialsSection() {
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
            SOCIAL PROOF
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-medium text-white leading-[1.05] tracking-tight"
          >
            Real Results. Real Deals.
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
    q: "Do I need perfect credit to get SBA financing?",
    a: "Not perfect — but solid. Generally, a 650+ credit score is a starting point, and Ryan can help you assess your readiness before you apply. He looks at the full picture, not just a number.",
  },
  {
    q: "How long does an acquisition typically take?",
    a: "Most deals close in 60–120 days depending on due diligence and financing timelines. Ryan manages the process proactively so nothing falls through the cracks.",
  },
  {
    q: "What types of businesses does Ryan work with?",
    a: "Main Street to lower middle market — service businesses, retail, restaurants, professional practices, and more. If there's a real business with real cash flow, Ryan can work with it.",
  },
  {
    q: "What does working with Ryan cost?",
    a: "Start with a free consultation. Fees are discussed based on the deal structure, so there's no guessing game and no surprises.",
  },
  {
    q: "Can I sell my business and stay involved after the sale?",
    a: "Yes. Ryan can help structure deals that include transition periods, consulting agreements, or partial ownership arrangements — whatever works best for both parties.",
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
            Common Questions,<br className="hidden sm:block" /> Straight Answers
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
                Your Next Move Starts With One Conversation.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-white/50 text-base sm:text-lg leading-relaxed"
              >
                Whether you're selling, buying, or just figuring out if this is
                even the right time — let's talk. No pressure, no pitch. Just a
                real conversation about what's possible.
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
              <p className="text-white/30 text-xs tracking-wide text-left md:text-center">
                No commitment required. Typical response within 24 hours.
              </p>
            </motion.div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main Export ───────────────────────────────────────────────────────────────
export default function BusinessAcquisition() {
  return (
    <div className="relative bg-black min-h-screen">
      <HeroSection />
      <QuickStatsStrip />
      <ProblemSection />
      <WhoThisIsForSection />
      <HowRyanHelpsSection />
      <SBAFinancingSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
    </div>
  );
}
