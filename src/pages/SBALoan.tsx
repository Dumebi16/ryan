import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, ReactNode } from "react";
import ryan32 from "../../photos/Ryan Kroge pics/Ryan_Kroge-32 (1).jpg";
import ryan85 from "../../photos/Ryan Kroge pics/Ryan_Kroge-85 BW.jpg";
import {
  DollarSign,
  Calendar,
  TrendingUp,
  Shield,
  XCircle,
  Wallet,
  Clock,
  ArrowUpRight,
  FileText,
  BarChart2,
  Receipt,
  CreditCard,
  Home,
  Landmark,
  UserCheck,
  CheckCircle,
  ArrowRight,
  Star,
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
  const rotateLeft = useTransform(scrollY, [0, 800], [-12, 0]);
  const rotateRight = useTransform(scrollY, [0, 800], [12, 0]);
  const scaleDyn = useTransform(scrollY, [0, 800], [1, 1.25]);
  const yDynLeft = useTransform(scrollY, [0, 800], [0, -100]);
  const yDynRight = useTransform(scrollY, [0, 800], [0, 100]);

  return (
    <section className="relative w-full flex flex-col items-center justify-center min-h-[95vh] px-6 pt-36 sm:pt-48 pb-20 overflow-hidden">
      {/* Gold radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 55% at 50% 65%, rgba(212,175,55,0.09) 0%, transparent 70%)",
        }}
      />

      {/* Dynamic Background Images */}
      <motion.div
        style={{ scale: scaleDyn, rotate: rotateLeft, y: yDynLeft }}
        className="absolute left-[-25%] sm:left-[-15%] md:left-[-5%] lg:left-[0%] top-[10%] md:top-[12%] w-40 sm:w-48 md:w-56 lg:w-64 aspect-[3/4] opacity-[0.25] md:opacity-[0.35] pointer-events-none overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img src={ryan32} alt="" className="w-full h-full object-cover grayscale" />
      </motion.div>

      <motion.div
        style={{ scale: scaleDyn, rotate: rotateRight, y: yDynRight }}
        className="absolute right-[-25%] sm:right-[-15%] md:right-[-5%] lg:right-[0%] top-[45%] md:top-[40%] w-40 sm:w-48 md:w-56 lg:w-64 aspect-[3/4] opacity-[0.25] md:opacity-[0.35] pointer-events-none overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img src={ryan85} alt="" className="w-full h-full object-cover grayscale" />
      </motion.div>

      <div className="relative z-20 flex flex-col items-center text-center max-w-4xl mx-auto my-auto">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-kiona text-[9px] sm:text-[10px] text-white tracking-[0.3em] mb-8 block uppercase"
        >
          SBA LOANS
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] font-medium text-white leading-[1.0] tracking-tight mb-8"
        >
          The Smarter Way<br />to Fund Your Business
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-white/55 text-lg sm:text-xl max-w-2xl leading-relaxed mb-12"
        >
          Get the capital you need — with terms that actually work in your favor.
          Loans from $300K to $5M, with repayment terms up to 25 years and no
          balloon payments.
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

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
}

// ─── Highlights Strip ──────────────────────────────────────────────────────────
const HIGHLIGHTS = [
  { Icon: DollarSign, label: "Loans Up to $5M" },
  { Icon: Calendar, label: "Terms Up to 25 Years" },
  { Icon: TrendingUp, label: "Competitive Rates" },
  { Icon: Shield, label: "No Balloon Feature" },
];

function HighlightsStrip() {
  return (
    <section className="relative w-full border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-24 py-10 sm:py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {HIGHLIGHTS.map(({ Icon, label }, i) => (
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

// ─── What Is SBA ───────────────────────────────────────────────────────────────
function WhatIsSBASection() {
  return (
    <section className="relative w-full bg-black px-6 py-20 sm:py-28 lg:py-36 flex flex-col items-center justify-center border-t border-white/[0.04]">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="font-kiona text-[9px] sm:text-[10px] text-white tracking-[0.25em] font-medium mb-12 sm:mb-16 uppercase text-center"
      >
        UNDERSTANDING SBA
      </motion.span>

      <div className="w-full flex flex-col items-center space-y-2 sm:space-y-4">
        <RevealLine>An SBA loan is a small business loan</RevealLine>
        <RevealLine>partially guaranteed by the government.</RevealLine>

        <RevealLine isSpace />

        <RevealLine>Because the government backs part of the loan,</RevealLine>
        <RevealLine>lenders can offer better terms than you'd</RevealLine>
        <RevealLine>typically find at a traditional bank.</RevealLine>

        <RevealLine isSpace />

        <RevealLine>Lower down payments. Longer repayment windows.</RevealLine>
        <RevealLine>Access to larger amounts of capital.</RevealLine>

        <RevealLine isSpace />

        <RevealLine>Whether you're acquiring a business,</RevealLine>
        <RevealLine>expanding operations, purchasing equipment,</RevealLine>
        <RevealLine>or building your working capital —</RevealLine>

        <RevealLine>
          <span className="font-normal opacity-50">an SBA loan is one of the most powerful</span>
        </RevealLine>
        <RevealLine>
          <span className="font-normal opacity-50">financing tools available to you today.</span>
        </RevealLine>
      </div>
    </section>
  );
}

// ─── Is This For You ───────────────────────────────────────────────────────────
const FIT_CARDS = [
  {
    Icon: XCircle,
    title: "Turned Down by a Conventional Bank",
    desc: "Have been turned down by a conventional bank and need a lender who can work with your full picture.",
  },
  {
    Icon: Wallet,
    title: "No Large Upfront Down Payment",
    desc: "Don't have the cash for a large upfront down payment but have a solid business to back it up.",
  },
  {
    Icon: Clock,
    title: "Need More Time to Repay",
    desc: "Need more time to repay without the pressure of a short-term balloon hanging over your head.",
  },
  {
    Icon: ArrowUpRight,
    title: "Looking to Grow, Acquire, or Expand",
    desc: "Are looking to grow, acquire, or expand but need a reliable lending partner who can move fast.",
  },
];

function IsThisForYouSection() {
  return (
    <section className="relative w-full bg-black py-24 sm:py-32 px-6 sm:px-10 lg:px-24 border-t border-white/[0.04]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 sm:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-kiona text-[9px] sm:text-[10px] text-[#D4AF37] tracking-[0.25em] font-medium mb-6 block uppercase"
          >
            IS THIS FOR YOU?
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-medium text-white leading-[1.05] tracking-tight mb-6"
          >
            Is an SBA Loan the Right Fit<br className="hidden sm:block" />{" "}
            for Your Business?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-white/50 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            An SBA loan is a strong option if you need meaningful capital but
            want flexibility in how you pay it back.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-12">
          {FIT_CARDS.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
              className="bg-[#0a0a0a]/60 backdrop-blur-lg border border-white/[0.08] p-8 sm:p-10 flex flex-col gap-5 relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
              <Icon className="w-6 h-6 text-[#D4AF37]" strokeWidth={1.5} />
              <div>
                <h3 className="text-white text-xl font-medium mb-3 tracking-tight leading-snug">
                  {title}
                </h3>
                <p className="text-white/50 text-base leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center text-white/50 text-lg italic"
        >
          If any of these sound familiar, you're likely in the right place.
        </motion.p>
      </div>
    </section>
  );
}

// ─── Why Ryan ──────────────────────────────────────────────────────────────────
const WHY_RYAN_CARDS = [
  {
    num: "01.",
    title: "I've seen both sides of the table.",
    desc: "With over 25 years in banking and SBA financing, Ryan brings the inside perspective of someone who has sat on both sides. He knows exactly what lenders look for — and uses that knowledge to prepare your application strategically.",
  },
  {
    num: "02.",
    title: "Transparent. Honest. Fast.",
    desc: "Ryan takes the time to understand your business before recommending a single product. He's transparent about your options, honest about timelines, and committed to giving you a clear answer — yes or no — within 24 hours of your discovery call.",
  },
  {
    num: "03.",
    title: "He works for you, not the bank.",
    desc: "Every application is prepared to advocate for the best possible outcome on your behalf. No runaround. No vague timelines. Just a real answer and a real plan to move forward.",
  },
];

const STATS = [
  { value: "25+", label: "Years Experience" },
  { value: "24hr", label: "Response" },
  { value: "$0", label: "Surprise Fees" },
];

const CREDENTIALS = [
  "Inside perspective from both sides of the lending table",
  "Application prepared strategically for the best outcome",
  "Transparent about options and honest about timelines",
  "Clear yes or no answer within 24 hours of discovery call",
];

function WhyRyanSection() {
  return (
    <section className="relative w-full bg-black border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 lg:px-24 flex flex-col md:flex-row items-start relative">

        {/* Left Sticky Panel */}
        <div className="md:w-[40%] md:sticky md:top-0 md:h-screen flex flex-col justify-center pt-20 pb-10 md:pt-0 md:pb-0 z-10 self-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <h3 className="font-kiona text-[9px] sm:text-[10px] text-white tracking-[0.25em] font-medium mb-6 sm:mb-8 uppercase">
              WHY RYAN KROGE
            </h3>
            <h2 className="text-3xl sm:text-4xl md:text-[2.6rem] font-medium tracking-tight text-white leading-[1.05] max-w-sm mb-10">
              A Lending Expert Who Works For You,{" "}
              <span className="text-white/35">Not the Bank.</span>
            </h2>

            {/* Stat Boxes */}
            <div className="flex flex-col gap-3 max-w-[280px]">
              {STATS.map(({ value, label }, i) => (
                <div
                  key={i}
                  className="bg-[#0a0a0a]/60 backdrop-blur-lg border border-white/[0.08] px-6 py-4 flex items-center gap-5 relative overflow-hidden"
                >
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
                  <span className="text-[#D4AF37] text-2xl sm:text-3xl font-medium tracking-tight">
                    {value}
                  </span>
                  <span className="text-white/55 text-sm font-light">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Scrolling Panel */}
        <div className="md:w-[60%] flex flex-col pb-24 md:py-32 relative z-0">
          {/* Numbered cards */}
          {WHY_RYAN_CARDS.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0.15, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ amount: 0.5, margin: "-10% 0px -10% 0px" }}
              className="flex flex-col justify-center min-h-[40vh] md:min-h-[70vh] border-b border-white/[0.05] last:border-b-0 py-12 md:py-0"
            >
              <span className="font-kiona text-[#D4AF37] text-sm md:text-base tracking-[0.2em] mb-4 md:mb-6 block font-medium">
                {card.num}
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl text-white font-medium mb-4 md:mb-6 leading-snug">
                {card.title}
              </h3>
              <p className="text-lg sm:text-xl text-white/50 leading-[1.5] max-w-xl">
                {card.desc}
              </p>
            </motion.div>
          ))}

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0.15, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ amount: 0.4, margin: "-10% 0px -10% 0px" }}
            className="flex flex-col justify-center min-h-[40vh] md:min-h-[60vh] border-b border-white/[0.05] py-12 md:py-0"
          >
            <div className="bg-[#0a0a0a]/60 backdrop-blur-lg border border-white/[0.08] p-8 sm:p-10 relative overflow-hidden max-w-xl">
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/[0.02] to-transparent pointer-events-none" />
              <Star className="w-5 h-5 text-[#D4AF37] mb-6" strokeWidth={1.5} />
              <p className="text-white/80 text-xl sm:text-2xl font-medium leading-snug tracking-tight mb-6 italic">
                "Extremely knowledgeable and passionate, Ryan is on top of his game!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-[1px] bg-[#D4AF37]/40" />
                <div>
                  <p className="text-white text-sm font-medium">Brandon Shaya</p>
                  <p className="text-white/40 text-xs">Business Owner</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Credentials */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-col justify-center min-h-[40vh] md:min-h-[50vh] py-12 md:py-0"
          >
            <h3 className="font-kiona text-[9px] sm:text-[10px] text-white tracking-[0.25em] mb-8 uppercase">
              WHAT YOU GET
            </h3>
            <ul className="flex flex-col gap-5 max-w-xl">
              {CREDENTIALS.map((cred, i) => (
                <li key={i} className="flex items-start gap-4">
                  <CheckCircle
                    className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5"
                    strokeWidth={1.5}
                  />
                  <span className="text-white/65 text-lg leading-snug">{cred}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── What You'll Need ──────────────────────────────────────────────────────────
const DOCUMENTS = [
  {
    Icon: FileText,
    title: "Business Plan",
    desc: "A clear outline of your business goals and how you plan to achieve them",
  },
  {
    Icon: BarChart2,
    title: "Financial Statements",
    desc: "Income statements, balance sheets, and cash flow statements",
  },
  {
    Icon: Receipt,
    title: "Tax Returns",
    desc: "Both personal and business returns from the past two years",
  },
  {
    Icon: CreditCard,
    title: "Credit History",
    desc: "We look at the full picture, not just a number",
  },
  {
    Icon: Home,
    title: "Collateral",
    desc: "If applicable; real estate, equipment, or other business assets",
  },
  {
    Icon: Landmark,
    title: "Bank Account Information",
    desc: "To verify financial health and cash flow",
  },
  {
    Icon: UserCheck,
    title: "Government-Issued ID",
    desc: "Required for all business owners",
  },
];

function WhatYouNeedSection() {
  return (
    <section className="relative w-full bg-black py-24 sm:py-32 px-6 sm:px-10 lg:px-24 border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 sm:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-kiona text-[9px] sm:text-[10px] text-white tracking-[0.25em] font-medium mb-6 block uppercase"
          >
            BEFORE YOU APPLY
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-medium text-white leading-[1.05] tracking-tight mb-6"
          >
            Here's What to Have Ready
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-white/50 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Gathering the right documents upfront makes the process faster and
            smoother for everyone.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {DOCUMENTS.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              viewport={{ once: true, amount: 0.2 }}
              className="bg-[#0a0a0a]/60 backdrop-blur-lg border border-white/[0.08] p-6 sm:p-8 flex flex-col gap-4 relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
              <Icon className="w-6 h-6 text-[#D4AF37]" strokeWidth={1.5} />
              <div>
                <h3 className="text-white text-base font-medium mb-2 tracking-tight">
                  {title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Callout bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="border border-[#D4AF37]/20 p-8 text-center relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(212,175,55,0.04) 0%, transparent 60%)",
          }}
        >
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
          <p className="text-white/65 text-lg sm:text-xl font-light">
            Not sure if you have everything?{" "}
            <span className="text-white font-medium">
              That's what the discovery call is for.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Application Process ───────────────────────────────────────────────────────
const STEPS = [
  {
    tag: "STEP 1",
    title: "Submit in Minutes",
    desc: "Complete a single, straightforward application in under 5 minutes. Tell us about your business, yourself, and connect your bank account — that's it.",
    Icon: FileText,
  },
  {
    tag: "STEP 2",
    title: "Get Approved in Hours",
    desc: "Ryan and his team review your information and present the best financing options tailored specifically to your business. No guesswork. No runaround.",
    Icon: CheckCircle,
  },
  {
    tag: "STEP 3",
    title: "Receive Your Funds",
    desc: "Once approved, funding can arrive in as little as 30 days. Fast, efficient, and built around your timeline.",
    Icon: DollarSign,
  },
];

function ApplicationProcessSection() {
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
            SIMPLE LOAN APPLICATION
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-medium text-white leading-[1.05] tracking-tight mb-6"
          >
            Three Steps to Funding<br className="hidden sm:block" /> Your Business
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-white/50 text-lg sm:text-xl max-w-xl mx-auto"
          >
            Get pre-qualified in as little as 24 hours.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 relative">
          {STEPS.map(({ tag, title, desc, Icon }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true, amount: 0.3 }}
              className="relative z-10 bg-[#0a0a0a]/60 backdrop-blur-lg border border-white/[0.08] p-8 sm:p-10 flex flex-col gap-6 overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

              {/* Icon badge + step label */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border border-[#D4AF37]/35 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#D4AF37]" strokeWidth={1.5} />
                </div>
                <span className="font-kiona text-[8px] sm:text-[9px] text-[#D4AF37] tracking-[0.25em] uppercase">
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

// ─── Final CTA ─────────────────────────────────────────────────────────────────
function FinalCTASection() {
  return (
    <section className="relative w-full bg-black py-24 sm:py-32 px-6 sm:px-10 lg:px-24 border-t border-white/[0.04]">
      {/* Subtle gold glow */}
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
            {/* Left: Copy */}
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
                Ready to Take<br />the Next Step?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-white/50 text-base sm:text-lg leading-relaxed"
              >
                You've worked hard to build your business. Now let's make sure
                you have the capital to take it further. Ryan is ready to review
                your situation and find the right loan for where you want to go
                — not just where you are today.
              </motion.p>
            </div>

            {/* Right: CTAs */}
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
              <a
                href="https://ryankroge.com/contact/"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full md:w-auto inline-flex items-center justify-center gap-3 text-white/70 hover:text-white text-[11px] font-kiona tracking-widest uppercase transition-colors duration-300 py-2"
              >
                BOOK A CALL
              </a>
            </motion.div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main Export ───────────────────────────────────────────────────────────────
export default function SBALoan() {
  return (
    <div className="relative bg-black min-h-screen">
      <HeroSection />
      <HighlightsStrip />
      <WhatIsSBASection />
      <IsThisForYouSection />
      <WhyRyanSection />
      <WhatYouNeedSection />
      <ApplicationProcessSection />
      <FinalCTASection />
    </div>
  );
}
