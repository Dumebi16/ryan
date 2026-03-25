/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { ArrowRight, ArrowLeft, Menu, X, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import ryanLaptopImg from '@/photos/Ryan Kroge pics/ryan using his laptop.jpg';

// ---------------------------------------------------------------------------
// Dot ring helper — places n dots evenly around a circle
// ---------------------------------------------------------------------------
const ringPts = (cx: number, cy: number, r: number, n: number, startA = -Math.PI / 2) =>
  Array.from({ length: n }, (_, i) => {
    const a = startA + (i / n) * 2 * Math.PI;
    return [+(cx + r * Math.cos(a)).toFixed(2), +(cy + r * Math.sin(a)).toFixed(2)] as [number, number];
  });

// SBA Loans — five tight concentric rings converging to a centre point
// Evokes precision, capital concentration, and focused financial power
const SBALoansIcon = ({ className }: { className?: string }) => {
  const [cx, cy] = [90, 80];
  const dots: [number, number][] = [
    ...ringPts(cx, cy, 70, 44),
    ...ringPts(cx, cy, 56, 35),
    ...ringPts(cx, cy, 42, 26),
    ...ringPts(cx, cy, 28, 17),
    ...ringPts(cx, cy, 14,  9),
    [cx, cy],
  ];
  return (
    <svg viewBox="0 0 180 160" fill="currentColor" className={className} aria-hidden="true">
      {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.85} />)}
    </svg>
  );
};

// Business Acquisition — two offset circles joined by a dot bridge
// Represents two distinct entities (buyer + seller) converging through a deal
const AcquisitionIcon = ({ className }: { className?: string }) => {
  const dots: [number, number][] = [
    ...ringPts(64,  80, 52, 33),
    ...ringPts(64,  80, 32, 20),
    ...ringPts(116, 80, 52, 33),
    ...ringPts(116, 80, 32, 20),
    // Bridge of connecting dots running between the two circles
    ...Array.from({ length: 11 }, (_, i): [number, number] => [
      +(82 + i * 2.9).toFixed(1),
      +(80 + Math.sin((i / 10) * Math.PI) * 6).toFixed(1),
    ]),
  ];
  return (
    <svg viewBox="0 0 180 160" fill="currentColor" className={className} aria-hidden="true">
      {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.85} />)}
    </svg>
  );
};

// Strategic Financial Guidance — outer ring + three ascending parabolic arcs
// Evokes momentum, upward trajectory, and strategic clarity
const GuidanceIcon = ({ className }: { className?: string }) => {
  const [cx, cy, r] = [90, 80, 70];
  const outer = ringPts(cx, cy, r, 44);

  // Generate one arc of dots clipped to the bounding circle
  const arc = (yShift: number, xShift: number): [number, number][] =>
    Array.from({ length: 20 }, (_, i) => {
      const t = i / 19;
      const x = 24 + xShift + t * 132;
      const y = 142 + yShift - Math.pow(t, 1.15) * 120;
      return [+x.toFixed(1), +y.toFixed(1)] as [number, number];
    }).filter(([px, py]) => (px - cx) ** 2 + (py - cy) ** 2 <= (r - 4) ** 2);

  const dots: [number, number][] = [
    ...outer,
    ...arc(  0,  0),
    ...arc(-15,  2),
    ...arc( 15, -2),
  ];
  return (
    <svg viewBox="0 0 180 160" fill="currentColor" className={className} aria-hidden="true">
      {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.85} />)}
    </svg>
  );
};

// --- Feature badge icons (32×32 viewBox, white fill, for 44px black badge) ---

// Deep SBA Expertise: concentric target rings — precision and depth of experience
const ExpertiseIcon = ({ className }: { className?: string }) => {
  const dots: [number, number][] = [
    ...ringPts(16, 16, 11, 10),
    ...ringPts(16, 16,  6,  7),
    [16, 16],
  ];
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" className={className ?? "w-[22px] h-[22px]"}>
      {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.6} />)}
    </svg>
  );
};

// Clear Guidance: rightward arrow — direction, clarity, next steps
const GuidanceSmallIcon = ({ className }: { className?: string }) => {
  const shaft: [number, number][] = Array.from({ length: 6 }, (_, i) => [5 + i * 3.1, 16] as [number, number]);
  const head: [number, number][] = [[20, 11.5], [22.5, 14], [24, 16], [22.5, 18], [20, 20.5]];
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" className={className ?? "w-[22px] h-[22px]"}>
      {[...shaft, ...head].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.6} />)}
    </svg>
  );
};

// Acquisition Insight: magnifying glass — discovery, analysis, deal-level view
const InsightIcon = ({ className }: { className?: string }) => {
  const lens = ringPts(13.5, 13.5, 8.5, 12);
  const handle: [number, number][] = [[19.5, 19.5], [21.5, 21.5], [23.5, 23.5]];
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" className={className ?? "w-[22px] h-[22px]"}>
      {[...lens, ...handle].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.6} />)}
    </svg>
  );
};

// Responsive Process: open clockwise arc — momentum, cycle, fast response
const ProcessSmallIcon = ({ className }: { className?: string }) => {
  const arc = Array.from({ length: 16 }, (_, i): [number, number] => {
    const a = -Math.PI / 2 + (i / 15) * (1.72 * Math.PI);
    return [+(16 + 11 * Math.cos(a)).toFixed(1), +(16 + 11 * Math.sin(a)).toFixed(1)];
  });
  // Two-dot arrowhead at the open end
  const ea = -Math.PI / 2 + 1.72 * Math.PI;
  const arrow: [number, number][] = [
    [+(16 + 8.5 * Math.cos(ea - 0.32)).toFixed(1), +(16 + 8.5 * Math.sin(ea - 0.32)).toFixed(1)],
    [+(16 + 8.5 * Math.cos(ea + 0.32)).toFixed(1), +(16 + 8.5 * Math.sin(ea + 0.32)).toFixed(1)],
  ];
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" className={className ?? "w-[22px] h-[22px]"}>
      {[...arc, ...arrow].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.6} />)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Process step visual icons — compact 160×100 viewBox, currentColor fill
// ---------------------------------------------------------------------------

// Step 1 — Discovery Call: two facing arcs (entities in conversation)
const DiscoveryIcon = ({ className }: { className?: string }) => {
  // Left entity: right-facing arc (opens toward center)
  const leftArc = Array.from({ length: 14 }, (_, i): [number, number] => {
    const a = -Math.PI / 2 + (i / 13) * Math.PI;
    return [+(44 + 30 * Math.cos(a)).toFixed(1), +(50 + 30 * Math.sin(a)).toFixed(1)];
  });
  // Right entity: left-facing arc (opens toward center)
  const rightArc = Array.from({ length: 14 }, (_, i): [number, number] => {
    const a = Math.PI / 2 + (i / 13) * Math.PI;
    return [+(116 + 30 * Math.cos(a)).toFixed(1), +(50 + 30 * Math.sin(a)).toFixed(1)];
  });
  const dots: [number, number][] = [
    ...leftArc,  ...rightArc,
    ...ringPts(44,  50, 16, 9),
    ...ringPts(116, 50, 16, 9),
  ];
  return (
    <svg viewBox="0 0 160 100" fill="currentColor" className={className} aria-hidden="true">
      {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.8} />)}
    </svg>
  );
};

// Step 2 — Qualification Review: staggered horizontal rows (document / checklist)
const ReviewIcon = ({ className }: { className?: string }) => {
  const rows: { y: number; end: number }[] = [
    { y: 18, end: 140 }, { y: 34, end: 108 },
    { y: 50, end: 130 }, { y: 66, end: 95  },
    { y: 82, end: 118 },
  ];
  const dots: [number, number][] = rows.flatMap(({ y, end }) =>
    Array.from({ length: Math.floor((end - 20) / 9) + 1 }, (_, i): [number, number] => [20 + i * 9, y])
  );
  return (
    <svg viewBox="0 0 160 100" fill="currentColor" className={className} aria-hidden="true">
      {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.8} />)}
    </svg>
  );
};

// Step 3 — Loan Strategy: trunk that forks into three paths (options / structure)
const StrategyIcon = ({ className }: { className?: string }) => {
  const trunk: [number, number][] = Array.from({ length: 5 }, (_, i) => [80, 12 + i * 10] as [number, number]);
  const branch = (tx: number): [number, number][] =>
    Array.from({ length: 5 }, (_, i) => {
      const t = (i + 1) / 5;
      return [+(80 + t * (tx - 80)).toFixed(1), +(62 + t * 26).toFixed(1)] as [number, number];
    });
  const dots: [number, number][] = [
    ...trunk, [80, 62],
    ...branch(28), ...branch(80), ...branch(132),
  ];
  return (
    <svg viewBox="0 0 160 100" fill="currentColor" className={className} aria-hidden="true">
      {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.8} />)}
    </svg>
  );
};

// Step 4 — Move to Funding: rising arc culminating in a dense cluster (success)
const FundingIcon = ({ className }: { className?: string }) => {
  const arc = Array.from({ length: 17 }, (_, i): [number, number] => {
    const t = i / 16;
    return [+(18 + t * 118).toFixed(1), +(88 - Math.pow(t, 1.2) * 72).toFixed(1)];
  });
  const dots: [number, number][] = [
    ...arc,
    ...ringPts(136, 16, 12, 10),
    ...ringPts(136, 16,  5,  6),
    [136, 16],
  ];
  return (
    <svg viewBox="0 0 160 100" fill="currentColor" className={className} aria-hidden="true">
      {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.8} />)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Anti-gravity Process Section
// ---------------------------------------------------------------------------

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Discovery Call",
    body: "Discuss the business, the opportunity, the funding need, and the timeline.",
    Icon: DiscoveryIcon,
  },
  {
    num: "02",
    title: "Qualification Review",
    body: "Review key documents such as tax returns, financial statements, and ownership details.",
    Icon: ReviewIcon,
  },
  {
    num: "03",
    title: "Loan Strategy",
    body: "Align the opportunity with the right SBA structure and lender expectations.",
    Icon: StrategyIcon,
  },
  {
    num: "04",
    title: "Move to Funding",
    body: "Advance with a clear path toward approval, closing, and capital access.",
    Icon: FundingIcon,
  },
];

// ── Per-step blur/focus card ─────────────────────────────────────────────────
// scrollYProgress goes 0→1 across the entire right-column scroll.
// Each step exclusively owns zone [i/N, (i+1)/N] — zones NEVER overlap.
// Within its zone:
const ProcessSection = () => {
  const rightColRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [stepDir, setStepDir] = useState<1 | -1>(1);
  const prevStepRef = useRef(0);

  const { scrollYProgress } = useScroll({ container: rightColRef });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const N = PROCESS_STEPS.length;
    const next = Math.min(Math.floor(v * N), N - 1);
    if (next !== prevStepRef.current) {
      setStepDir(next > prevStepRef.current ? 1 : -1);
      prevStepRef.current = next;
      setActiveStep(next);
    }
  });

  return (
    <>
      {/* ── MOBILE: static step list ───────────────────────────────────── */}
      <section className="lg:hidden relative bg-[#F5F5F0] border-t border-black/8 px-6 sm:px-10 pt-20 pb-20">

        <div className="mb-14">
          <span className="font-kiona text-[9px] text-black/35 block mb-6">PROCESS</span>
          <h2 className="text-[1.75rem] sm:text-[2rem] font-medium text-black leading-tight tracking-tight mb-5">
            A Clear Path<br />to Funding
          </h2>
          <p className="text-sm text-black/50 leading-relaxed max-w-xs">
            The process is designed to move quickly while giving you real clarity
            on what is possible and what comes next.
          </p>
        </div>

        <div className="flex flex-col divide-y divide-black/8">
          {PROCESS_STEPS.map((step) => (
            <div key={step.num} className="py-10">
              <div className="flex items-start gap-4 mb-4">
                <span className="font-kiona text-[8px] text-black/30 shrink-0 pt-[3px]">
                  STEP {step.num}
                </span>
                <h3 className="text-[1.5rem] sm:text-[1.75rem] font-medium text-black leading-tight tracking-tight">
                  {step.title}
                </h3>
              </div>
              <p className="text-sm text-black/50 leading-relaxed mb-8 pl-[52px] max-w-[280px]">
                {step.body}
              </p>
              <step.Icon className="w-full max-w-[160px] text-black/14" />
            </div>
          ))}
        </div>


      </section>

      {/* ── DESKTOP: sticky split-screen ──────────────────────────────── */}
      <section className="hidden lg:flex relative bg-[#F5F5F0] border-t border-black/8 h-screen overflow-hidden">

        {/* Left column — static, vertically centred */}
        <div className="shrink-0 w-[42%] flex flex-col justify-center pl-24 pr-10 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <span className="font-kiona text-[9px] text-black/35 block mb-6">PROCESS</span>
            <h2 className="text-[1.75rem] md:text-[2rem] xl:text-[2.5rem] font-medium text-black leading-tight tracking-tight mb-5">
              A Clear Path<br />to Funding
            </h2>
            <p className="text-sm md:text-[15px] text-black/50 leading-relaxed mb-10 max-w-xs">
              The process is designed to move quickly while giving you real
              clarity on what is possible and what comes next.
            </p>
          </motion.div>

          {/* Step progress tracker */}
          <div className="flex flex-col gap-4">
            {PROCESS_STEPS.map((s, i) => (
              <div key={s.num} className="flex items-center gap-3.5">
                <div
                  className="rounded-full transition-all duration-500 shrink-0"
                  style={{
                    width:           i === activeStep ? "20px" : "7px",
                    height:          "7px",
                    backgroundColor: i === activeStep
                      ? "#D4AF37"
                      : i < activeStep
                      ? "rgba(0,0,0,0.32)"
                      : "rgba(0,0,0,0.14)",
                  }}
                />
                <span
                  className="font-kiona text-[8px] transition-all duration-500"
                  style={{
                    color: i === activeStep
                      ? "rgba(0,0,0,0.68)"
                      : i < activeStep
                      ? "rgba(0,0,0,0.33)"
                      : "rgba(0,0,0,0.2)",
                  }}
                >
                  {s.num} — {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — inner scroll drives blur/focus animations */}
        <div
          ref={rightColRef}
          className="flex-1 h-full overflow-y-scroll"
          style={{ scrollbarWidth: "none" } as object}
        >
          <div className="relative w-full" style={{ height: `${PROCESS_STEPS.length * 100}vh` }}>
            <div className="sticky top-0 h-screen relative">
              <AnimatePresence mode="sync" initial={false}>
                {(() => {
                  const step = PROCESS_STEPS[activeStep];
                  const { Icon } = step;
                  return (
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, y: stepDir * 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        y: stepDir * -16,
                        transition: { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] },
                      }}
                      transition={{ duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}
                      className="absolute inset-0 flex flex-col items-center justify-center will-change-transform px-6"
                    >
                      <div className="w-full max-w-sm">
                        <span className="font-kiona text-[8px] block mb-5 text-center text-black/75">
                          STEP {step.num}
                        </span>
                        <h3 className="text-[1.75rem] sm:text-[2rem] md:text-[2.25rem] font-medium leading-tight tracking-tight mb-4 text-center text-black">
                          {step.title}
                        </h3>
                        <p className="text-sm leading-relaxed mb-10 text-center max-w-[260px] mx-auto text-black/80">
                          {step.body}
                        </p>
                        <div>
                          <Icon className="w-full max-w-[200px] mx-auto text-black/40" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>
          </div>
        </div>


      </section>
    </>
  );
};

// ---------------------------------------------------------------------------

const TESTIMONIALS = [
  {
    quote:
      "Ryan Kroge successfully closed a $5.3MM SBA loan for my buyer in 85 days. Despite challenges with multiple sellers, three physical locations, and three different landlords, Ryan was persistent and contributed to various bank teams to make it happen.",
    author: "Jackie Ossin",
    role: "Business Broker",
    initials: "JO",
  },
  {
    quote:
      "Ryan is a top-notch banker for SBA Loans and an asset for any business broker. He prioritizes completing deals for his clients and has a skilled team supporting him. Thanks to his creativity and determination, we have successfully closed numerous deals together.",
    author: "Nadir Jiddou",
    role: "Business Broker",
    initials: "NJ",
  },
  {
    quote:
      "Ryan took the complexity out of the SBA process and helped us close a deal we were not sure would get done. His understanding of lender expectations and deal structure made all the difference from start to finish.",
    author: "David Park",
    role: "Business Buyer",
    initials: "DP",
  },
];

const TestimonialsSection = () => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const handleChange = (index: number) => {
    if (index === active) return;
    setDirection(index > active ? 1 : -1);
    setActive(index);
  };

  const handlePrev = () =>
    handleChange(active === 0 ? TESTIMONIALS.length - 1 : active - 1);
  const handleNext = () =>
    handleChange(active === TESTIMONIALS.length - 1 ? 0 : active + 1);

  const current = TESTIMONIALS[active];

  return (
    <section className="bg-black border-t border-white/[0.06] px-6 sm:px-10 lg:px-24 pt-24 md:pt-32 pb-28 md:pb-40">

      {/* ── Eyebrow ─────────────────────────────────────────────────────── */}
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        className="font-kiona text-[9px] text-white/30 block mb-16 md:mb-20 tracking-widest"
      >
        CLIENT RESULTS
      </motion.span>

      {/* ── Main editorial block ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.08 }}
        viewport={{ once: true, amount: 0.2 }}
        className="flex items-start gap-6 md:gap-12 max-w-4xl"
      >
        {/* Large index number */}
        <AnimatePresence mode="wait">
          <motion.span
            key={`num-${active}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
            className="text-[72px] md:text-[112px] font-light leading-none text-white/[0.06] select-none shrink-0 tabular-nums"
            style={{ fontFeatureSettings: '"tnum"' }}
          >
            {String(active + 1).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>

        <div className="flex-1 pt-3 md:pt-6 min-w-0">

          {/* Quote */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.blockquote
              key={`quote-${active}`}
              custom={direction}
              initial={{ opacity: 0, x: direction * 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -14 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-[1.2rem] sm:text-[1.45rem] md:text-[1.6rem] font-light text-white/80 leading-relaxed tracking-tight mb-10"
            >
              &ldquo;{current.quote}&rdquo;
            </motion.blockquote>
          </AnimatePresence>

          {/* Author row */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`author-${active}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, delay: 0.08 }}
              className="flex items-center gap-4"
            >
              <div className="w-11 h-11 rounded-full border border-white/12 flex items-center justify-center shrink-0">
                <span className="font-kiona text-[8px] text-white/40 tracking-widest">
                  {current.initials}
                </span>
              </div>
              <div>
                <p className="text-[14px] font-medium text-white/85 leading-tight">
                  {current.author}
                </p>
                <p className="font-kiona text-[7px] text-white/30 tracking-widest mt-1">
                  {current.role.toUpperCase()}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </motion.div>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true, amount: 0.3 }}
        className="flex items-center justify-between max-w-4xl mt-16 md:mt-20"
      >
        <div className="flex items-center gap-8">
          {/* Line selectors */}
          <div className="flex items-center gap-3">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => handleChange(i)}
                className="group py-4"
                aria-label={`Go to testimonial ${i + 1}`}
              >
                <span
                  className={`block h-px transition-all duration-500 ease-out ${
                    i === active
                      ? "w-12 bg-[#D4AF37]"
                      : "w-6 bg-white/[0.18] group-hover:w-9 group-hover:bg-white/[0.38]"
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="font-kiona text-[8px] text-white/22 tracking-widest">
            {String(active + 1).padStart(2, "0")} / {String(TESTIMONIALS.length).padStart(2, "0")}
          </span>
        </div>

        {/* Prev / Next */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            aria-label="Previous testimonial"
            className="p-2.5 text-white/30 hover:text-white/70 transition-colors duration-200"
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next testimonial"
            className="p-2.5 text-white/30 hover:text-white/70 transition-colors duration-200"
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>
      </motion.div>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.25 }}
        viewport={{ once: true, amount: 0.3 }}
        className="mt-14 md:mt-16 max-w-4xl"
      >
        <button className="font-kiona text-[11px] border border-white/20 text-white px-10 py-4 hover:bg-white hover:text-black hover:border-white transition-all duration-300 inline-flex items-center gap-3">
          VIEW MORE RECOMMENDATIONS <ArrowRight size={12} strokeWidth={1.5} />
        </button>
      </motion.div>

    </section>
  );
};

// ---------------------------------------------------------------------------

const AboutSection = () => {
  return (
    <section className="bg-black px-4 sm:px-6 lg:px-10 py-8 lg:py-12">

      {/* ── Inner box — bordered, floats inside the black section ──────── */}
      <div className="border border-white/[0.1] overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[72vh]">

          {/* ── Left: editorial portrait ──────────────────────────────── */}
          <div className="relative w-full h-[72vw] sm:h-[56vw] lg:h-auto lg:w-[44%] overflow-hidden shrink-0">
            <img
              src={ryanLaptopImg}
              alt="Ryan Kroge — SBA Loan Specialist"
              className="absolute inset-0 w-full h-full object-cover object-center grayscale"
            />
            <span className="absolute bottom-6 left-6 font-kiona text-[7px] text-white/40 tracking-widest">
              DETROIT, MI
            </span>
          </div>

          {/* ── Right: content ──────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col justify-between px-8 sm:px-12 lg:px-16 xl:px-20 py-12 lg:py-14 border-t lg:border-t-0 lg:border-l border-white/[0.08]">

            {/* Name label — top of column */}
            <p className="font-kiona text-[8px] text-white/28 tracking-[0.22em]">
              RYAN KROGE&nbsp;&nbsp;·&nbsp;&nbsp;SBA LOAN SPECIALIST
            </p>

            {/* Main content — vertically centred */}
            <div className="flex-1 flex flex-col justify-center py-12 lg:py-0 max-w-lg">

              <motion.span
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, amount: 0.3 }}
                className="font-kiona text-[9px] text-white/35 block mb-7 tracking-widest"
              >
                ABOUT RYAN
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.07 }}
                viewport={{ once: true, amount: 0.3 }}
                className="text-[1.75rem] sm:text-[2rem] lg:text-[2.25rem] font-medium text-white leading-tight tracking-tight mb-7"
              >
                Experienced Guidance for High-Stakes Business Decisions
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.14 }}
                viewport={{ once: true, amount: 0.3 }}
                className="text-[15px] text-white/50 leading-relaxed mb-10"
              >
                Ryan Kroge is an SBA loan specialist and business acquisition consultant based in Detroit and serving clients nationwide. With more than 25 years of lending and business experience, he helps business owners move through financing decisions with confidence, strategy, and a clear understanding of the path ahead.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <button className="font-kiona text-[11px] border border-white/20 text-white px-10 py-4 hover:bg-white hover:text-black hover:border-white transition-all duration-300 inline-flex items-center gap-3">
                  LEARN MORE ABOUT RYAN <ArrowRight size={12} strokeWidth={1.5} />
                </button>
              </motion.div>

            </div>

            {/* Bottom stats */}
            <div className="flex items-end justify-between pt-10 border-t border-white/[0.08]">
              <div>
                <p className="text-[2rem] font-light text-white leading-none mb-1">25+</p>
                <p className="font-kiona text-[7px] text-white/30 tracking-widest">YEARS EXPERIENCE</p>
              </div>
              <div className="text-right">
                <p className="text-[2rem] font-light text-white leading-none mb-1">100+</p>
                <p className="font-kiona text-[7px] text-white/30 tracking-widest">BUSINESSES HELPED</p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
};

// ---------------------------------------------------------------------------

const FAQ_ITEMS = [
  {
    question: "What types of businesses do you help?",
    answer:
      "Ryan works with business owners across most industries — from service businesses and franchises to manufacturing and professional practices. Whether you are expanding an existing operation, purchasing a business, or refinancing, the focus is on finding the right SBA structure for your specific situation.",
  },
  {
    question: "How long does SBA financing usually take?",
    answer:
      "Most SBA transactions move to closing in 60 to 90 days from a complete application. Timelines vary based on deal complexity and documentation readiness. Ryan provides initial qualification guidance within 24 hours so you understand your path before the process formally begins.",
  },
  {
    question: "What do I need to qualify?",
    answer:
      "Lenders typically evaluate business financials, personal credit, industry experience, and the overall strength of the opportunity. Requirements depend on the loan purpose and deal structure. Ryan reviews the key factors upfront and gives you honest feedback on where you stand before any formal submission.",
  },
  {
    question: "Can you help with business acquisitions?",
    answer:
      "Yes. Business acquisition is a core focus. Ryan guides buyers through the full SBA financing process — from understanding what lenders look for, to navigating deal structure, seller notes, and equity injection requirements. The goal is to position the deal correctly from the start.",
  },
];

const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-[#080808] border-t border-white/[0.07] px-6 sm:px-10 lg:px-24 py-20 md:py-28">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-20">

        {/* ── Left: heading block ──────────────────────────────────────── */}
        <div className="lg:w-[28%] shrink-0">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <span className="font-kiona text-[9px] text-white/30 block mb-6 tracking-widest">
              FAQ
            </span>
            <h2 className="text-[1.75rem] sm:text-[2rem] font-medium text-white/90 leading-tight tracking-tight mb-8">
              Common Questions
            </h2>
            <button className="font-kiona text-[11px] border border-white/20 text-white/75 px-8 py-3.5 hover:bg-white/[0.07] hover:border-white/35 hover:text-white transition-all duration-300 inline-flex items-center gap-3" style={{ boxShadow: "none" }} onMouseEnter={({ currentTarget }) => ((currentTarget as HTMLButtonElement).style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.4)")} onMouseLeave={({ currentTarget }) => ((currentTarget as HTMLButtonElement).style.boxShadow = "none")}>
              CONTACT RYAN <ArrowRight size={12} strokeWidth={1.5} />
            </button>
          </motion.div>
        </div>

        {/* ── Right: accordion ─────────────────────────────────────────── */}
        <div className="flex-1 border-t border-white/[0.10]">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="border-b border-white/[0.10]">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="group w-full flex items-start justify-between gap-6 py-6 text-left cursor-pointer px-2 -mx-2 rounded-sm transition-all duration-300"
                style={{ background: "transparent" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.06), 0 2px 12px rgba(0,0,0,0.35)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                }}
              >
                <span className="text-[1rem] md:text-[1.05rem] font-medium text-white/85 leading-snug group-hover:text-white/95 transition-colors duration-300">
                  {item.question}
                </span>
                <span
                  className={`shrink-0 mt-0.5 text-white/35 group-hover:text-white/55 transition-all duration-300 ease-out ${
                    open === i ? "rotate-45" : "rotate-0"
                  }`}
                >
                  <Plus size={16} strokeWidth={1.5} />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-7 px-0 text-[15px] text-white/45 leading-relaxed max-w-xl">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------

const BusinessAcquisitionSection = () => {
  return (
    <section className="relative bg-black overflow-hidden pb-28 md:pb-40">

      {/* ── Subtle warm depth at the center of the section ───────────── */}
      <div
        className="absolute inset-x-0 bottom-0 h-[70%] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 80%, rgba(212,175,55,0.04) 0%, transparent 100%)",
        }}
      />

      {/* ── Centered content ─────────────────────────────────────────── */}
      <div className="relative z-10 px-6 sm:px-10 lg:px-24 pt-16 md:pt-24 max-w-4xl mx-auto text-center">

        <span className="font-kiona text-[9px] text-white/30 block mb-10 md:mb-12 tracking-widest">
          BUSINESS ACQUISITION
        </span>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-[2.25rem] sm:text-[3rem] md:text-[3.75rem] font-medium text-white leading-[1.08] tracking-tight mb-8 md:mb-10"
        >
          Buying a Business Starts With the Right Financing Strategy
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-[15px] md:text-base text-white/45 leading-relaxed mb-12 md:mb-14 max-w-sm mx-auto"
        >
          More than approval — Ryan helps buyers understand structure, liquidity, and lender expectations so every deal moves forward with confidence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <button className="font-kiona text-[11px] border border-white/20 text-white px-10 py-4 hover:bg-white hover:text-black hover:border-white transition-all duration-300 inline-flex items-center gap-3">
            EXPLORE BUSINESS ACQUISITION <ArrowRight size={12} strokeWidth={1.5} />
          </button>
        </motion.div>

      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------

const FinalCTASection = () => {
  return (
    <section className="relative bg-black overflow-hidden px-6 sm:px-10 py-28 md:py-40">

      {/* ── Warm radial glow — centred behind content ─────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 55%, rgba(212,175,55,0.07) 0%, transparent 70%)",
        }}
      />

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-2xl mx-auto text-center">

        {/* Gold ornament */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.4 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.4 }}
          className="flex items-center justify-center gap-2.5 mb-10"
        >
          <span className="block h-px w-8 bg-white/50" />
          <span className="block w-1.5 h-1.5 rounded-full bg-white/70" />
          <span className="block h-px w-8 bg-white/50" />
        </motion.div>

        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          viewport={{ once: true, amount: 0.4 }}
          className="font-kiona text-[9px] text-white/30 block mb-8 tracking-widest"
        >
          GET STARTED
        </motion.span>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true, amount: 0.4 }}
          className="text-[2.25rem] sm:text-[3rem] md:text-[3.75rem] font-medium text-white leading-[1.08] tracking-tight mb-7"
        >
          Ready to Explore Your Funding Options?
        </motion.h2>

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.17 }}
          viewport={{ once: true, amount: 0.4 }}
          className="text-[15px] md:text-base text-white/45 leading-relaxed mb-12 max-w-md mx-auto"
        >
          Whether you are acquiring a business, preparing for growth, or evaluating SBA financing, Ryan can help you understand the next move.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.24 }}
          viewport={{ once: true, amount: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="font-kiona text-[11px] bg-[#D4AF37] text-white px-10 py-4 hover:bg-white hover:text-black transition-colors duration-300 inline-flex items-center gap-3 w-full sm:w-auto justify-center">
            START YOUR APPLICATION <ArrowRight size={12} strokeWidth={1.5} />
          </button>
          <button className="font-kiona text-[11px] border border-white/20 text-white px-10 py-4 hover:bg-white hover:text-black hover:border-white transition-all duration-300 inline-flex items-center gap-3 w-full sm:w-auto justify-center">
            BOOK A CALL
          </button>
        </motion.div>

      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navState, setNavState] = useState<'top' | 'hidden' | 'floating'>('top');
  const lastScrollYRef = useRef(0);
  const lastNavStateRef = useRef<'top' | 'hidden' | 'floating'>('top');

  useEffect(() => {
    const THRESHOLD = 80;
    const handle = () => {
      const y = window.scrollY;
      const down = y > lastScrollYRef.current;
      lastScrollYRef.current = y;
      const next: 'top' | 'hidden' | 'floating' =
        y < THRESHOLD ? 'top' : down ? 'hidden' : 'floating';
      if (next !== lastNavStateRef.current) {
        lastNavStateRef.current = next;
        setNavState(next);
      }
    };
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  return (
    <div className="min-h-screen bg-black text-secondary selection:bg-primary selection:text-black overflow-x-hidden relative">
      {/* Hero: Background Image — clean, no blur, magazine quality */}
      <div className="absolute top-0 left-0 right-0 h-screen z-0 overflow-hidden">
        <motion.img
          src="https://imagedelivery.net/0vuc79pYCDCfiNfFkSs8YA/74d0e1be-90ed-478d-c169-8e4752da2900/public"
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover object-center md:object-right md:translate-x-[4%] md:scale-[1.04] md:[filter:contrast(1.07)_brightness(1.03)]"
          referrerPolicy="no-referrer"
        />
        {/* Desktop: left-to-right fade — keeps text column dark, image visible right */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{ background: "linear-gradient(to right, #000000 18%, rgba(0,0,0,0.85) 36%, rgba(0,0,0,0.15) 68%, transparent 100%)" }}
        />
        {/* Mobile: uniform overlay for text legibility */}
        <div className="absolute inset-0 bg-black/52 md:hidden" />
        {/* Top vignette — nav legibility on all breakpoints */}
        <div
          className="absolute inset-x-0 top-0 h-40"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.65), transparent)" }}
        />
        {/* Bottom blend — seamless, blur-free fade into #F5F5F0 below */}
        <div
          className="absolute inset-x-0 bottom-0 h-52 sm:h-60 md:h-72"
          style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(245,245,240,0.55) 58%, #F5F5F0 100%)" }}
        />
      </div>

      {/* Navigation */}
      <div
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          paddingLeft:  navState === 'floating' ? '24px' : '0',
          paddingRight: navState === 'floating' ? '24px' : '0',
          paddingTop:   navState === 'floating' ? '12px' : '0',
          transition: 'padding 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
        }}
      >
        <motion.nav
          animate={{
            y: navState === 'hidden' ? -32 : 0,
            opacity: navState === 'hidden' ? 0 : 1,
            backgroundColor: navState === 'floating' ? 'rgba(0,0,0,0.42)' : 'rgba(0,0,0,0)',
            boxShadow: navState === 'floating'
              ? '0 0 0 1px rgba(255,255,255,0.11), 0 8px 32px rgba(0,0,0,0.40)'
              : '0 0 0 1px rgba(255,255,255,0), 0 0px 0px rgba(0,0,0,0)',
          }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            maxWidth:       navState === 'floating' ? '1200px'        : undefined,
            margin:         navState === 'floating' ? '0 auto'        : undefined,
            backdropFilter: navState === 'floating' ? 'blur(12px)'    : 'none',
            WebkitBackdropFilter: navState === 'floating' ? 'blur(12px)' : 'none',
          }}
          className="flex items-center justify-between px-6 py-5 md:px-10 md:py-4"
        >
          {/* Logo */}
          <div className="flex items-center">
            <span className="font-kiona text-base md:text-lg text-white tracking-[0.3em]">RYAN KROGE</span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-8">
            {['Home', 'About', 'SBA Loans', 'Blog'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="font-kiona text-[10px] text-white/90 hover:text-primary transition-colors">
                {item}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <button className="hidden md:block font-kiona text-[11px] border border-white/20 px-8 py-3 hover:bg-white hover:text-black hover:border-white transition-all duration-300">
              SCHEDULE A CALL
            </button>
            <button className="md:hidden p-2 text-white hover:text-primary transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu">
              {isMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Menu Overlay - Minimalist Redesign */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-sm md:hidden"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 h-full w-full flex flex-col items-center justify-center p-8"
            >
              <div className="flex flex-col items-center space-y-10">
                {['Home', 'About', 'SBA Loans', 'Blog'].map((item, i) => (
                  <motion.a 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    key={item} 
                    href={`#${item.toLowerCase().replace(' ', '-')}`} 
                    className="font-kiona text-lg text-white/80 hover:text-primary transition-colors tracking-[0.4em]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </motion.a>
                ))}
                <motion.button 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-kiona text-[10px] border border-white/20 text-white px-10 py-4 hover:bg-white hover:text-black transition-all tracking-[0.3em] mt-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  SCHEDULE A CALL
                </motion.button>
              </div>
              
              {/* Footer info in menu */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-12 text-center"
              >
                <p className="font-kiona text-[8px] text-white/20 tracking-[0.5em]">
                  EST. 2026 — RYAN KROGE
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <main className="relative flex flex-col items-start justify-center min-h-screen px-6 sm:px-10 md:px-16 lg:px-24 pt-24 pb-32 max-w-7xl z-10">

        {/* Main Headline - DM Sans Medium @ ~40px */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-[28px] sm:text-[32px] md:text-[40px] font-medium leading-tight mb-6 tracking-tight"
        >
          Get the <span className="text-primary italic">Capital</span> to <br className="hidden sm:block" />
          Scale Your Business Fast.
        </motion.h1>

        {/* Subheadline - DM Sans Regular */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-sm sm:text-base md:text-lg text-white/70 md:text-white/60 max-w-lg font-normal leading-relaxed mb-10"
        >
          Ryan Kroge makes SBA loans simple. We cut through the bank jargon
          to deliver the funding your vision deserves.
        </motion.p>

        {/* Primary Actions - START YOUR APPLICATION and EXPLORE SERVICES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center sm:items-center gap-6 w-full sm:w-auto"
        >
          <button className="w-full sm:w-auto font-kiona text-[11px] bg-white text-black px-8 py-4 border border-white transition-all duration-300 hover:bg-transparent hover:text-white">
            START YOUR APPLICATION
          </button>

          <button className="font-kiona text-[11px] text-white/80 hover:text-primary transition-colors tracking-[0.3em] py-2 text-center w-full sm:w-auto">
            EXPLORE SERVICES
          </button>
        </motion.div>

      </main>

      {/* Trust Stats Section */}
      <section className="relative z-10 bg-[#F5F5F0] py-20 md:py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-14 md:gap-20 items-start">

            {/* Left — H2 + body */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h2 className="text-[1.75rem] sm:text-[2rem] md:text-[2.5rem] font-medium text-black leading-tight tracking-tight mb-5">
                A More Strategic<br />Lending Partner
              </h2>
              <p className="text-sm md:text-[15px] text-black/55 leading-relaxed max-w-sm">
                Ryan Kroge is an SBA loan specialist and business acquisition consultant serving clients nationwide. With more than 25 years of lending experience, he helps business owners move through financing decisions with confidence and clarity.
              </p>
            </motion.div>

            {/* Right — Stats grid */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-10 md:gap-x-16 md:gap-y-12">
              {[
                { value: "25+", label: "Years Experience" },
                { value: "100+", label: "Businesses Helped" },
                { value: "24 Hours", label: "Initial Qualification Guidance" },
                { value: "$300K–$5M", label: "Typical Loan Range" },
                { value: "Nationwide", label: "Lending Support" },
              ].map(({ value, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.07 }}
                  viewport={{ once: true }}
                  className="flex flex-col"
                >
                  <span className="text-[2.25rem] sm:text-[2.75rem] md:text-[3.25rem] font-medium text-black leading-none">
                    {value}
                  </span>
                  <span className="font-kiona text-[8px] text-black/40 mt-3">
                    {label}
                  </span>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Core Services Section                                              */}
      {/* ------------------------------------------------------------------ */}
      <section id="services" className="relative z-10 bg-[#F5F5F0] py-20 md:py-28 px-6 sm:px-10 md:px-16 lg:px-24" style={{ backgroundImage: "radial-gradient(ellipse 65% 55% at 22% 65%, rgba(212,175,55,0.11) 0%, transparent 60%), radial-gradient(ellipse 55% 45% at 78% 35%, rgba(212,175,55,0.07) 0%, transparent 60%)" }}>
        <div className="max-w-7xl mx-auto">

          {/* Header row */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-16 lg:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="max-w-2xl"
            >
              <span className="font-kiona text-[9px] text-black/35 block mb-6">CAPABILITIES</span>
              <h2 className="text-[1.75rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[2.75rem] font-medium text-black leading-tight tracking-tight mb-5">
                Strategic Funding Solutions<br className="hidden sm:block" />
                for Growth, Acquisition,<br className="hidden sm:block" />
                and Long-Term Success
              </h2>
              <p className="text-sm md:text-[15px] text-black/50 leading-relaxed max-w-lg">
                Ryan works with business owners who need more than a loan product. He provides financing
                guidance, deal support, and strategic insight tailored to the stage and structure of the
                opportunity.
              </p>
            </motion.div>

            {/* Navigation arrows — decorative on desktop, functional on mobile scroll */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 shrink-0 self-start lg:self-end"
            >
              <button
                aria-label="Previous service"
                className="w-11 h-11 border border-black/15 flex items-center justify-center text-black/35 hover:border-black/40 hover:text-black transition-all duration-300"
              >
                <ArrowLeft size={15} strokeWidth={1.5} />
              </button>
              <button
                aria-label="Next service"
                className="w-11 h-11 bg-black text-white flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
              >
                <ArrowRight size={15} strokeWidth={1.5} />
              </button>
            </motion.div>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {(
              [
                {
                  title: "SBA Loans",
                  tag: "SBA 7(a) & 504",
                  description:
                    "Funding solutions for acquisitions, expansion, partner buyouts, equipment, and working capital.",
                  Icon: SBALoansIcon,
                },
                {
                  title: "Business Acquisition",
                  tag: "Buy-Side Advisory",
                  description:
                    "Guidance for buyers navigating valuation, structure, lender expectations, and the financing process.",
                  Icon: AcquisitionIcon,
                },
                {
                  title: "Strategic Financial Guidance",
                  tag: "Deal Strategy",
                  description:
                    "Clarity around loan readiness, financial positioning, and the decisions that shape a stronger funding outcome.",
                  Icon: GuidanceIcon,
                },
              ] as const
            ).map(({ title, tag, description, Icon }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.025, y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={{
                  default: { duration: 0.6, delay: i * 0.1 },
                  scale: { type: "spring", stiffness: 260, damping: 22 },
                  y: { type: "spring", stiffness: 260, damping: 22 },
                }}
                viewport={{ once: true }}
                className="bg-white/[0.18] backdrop-blur-xl rounded-2xl border border-white/50 shadow-[0_4px_24px_rgba(0,0,0,0.06),_0_1px_2px_rgba(0,0,0,0.04),_inset_0_1px_0_rgba(255,255,255,0.92),_inset_0_-1px_0_rgba(0,0,0,0.04)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.1),_0_2px_4px_rgba(0,0,0,0.06),_inset_0_1px_0_rgba(255,255,255,0.92)] transition-shadow duration-300 cursor-pointer flex flex-col p-8 sm:p-10 min-h-[440px] sm:min-h-[480px]"
              >
                {/* Card header */}
                <div className="flex items-start justify-between mb-6">
                  <h3 className="font-medium text-[1rem] md:text-[1.05rem] text-black leading-snug max-w-[72%]">
                    {title}
                  </h3>
                  <span className="font-kiona text-[7px] text-black/28 text-right leading-relaxed mt-0.5 shrink-0">
                    {tag}
                  </span>
                </div>

                {/* Dotted SVG icon */}
                <div className="flex-1 flex items-center justify-center py-4">
                  <Icon className="w-full max-w-[190px] text-black/18" />
                </div>

                {/* Description + learn more */}
                <div className="mt-auto pt-7 border-t border-black/8">
                  <p className="text-[13px] md:text-sm text-black/55 leading-relaxed">
                    {description}
                  </p>
                  <div className="flex items-center gap-2 mt-5">
                    <span className="font-kiona text-[8px] text-black/32">
                      LEARN MORE
                    </span>
                    <ArrowRight
                      size={10}
                      strokeWidth={1.5}
                      className="text-black/32"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Section CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-12 md:mt-14"
          >
            <button className="font-kiona text-[11px] border border-black/20 text-black px-10 py-4 hover:bg-black hover:text-white hover:border-black transition-all duration-300 flex items-center gap-3">
              VIEW ALL SERVICES
              <ArrowRight size={12} strokeWidth={1.5} />
            </button>
          </motion.div>

        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Why Ryan Section                                                   */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative z-10 bg-[#F5F5F0] border-t border-black/8 py-20 md:py-28 px-6 sm:px-10 md:px-16 lg:px-24" style={{ backgroundImage: "radial-gradient(ellipse 65% 55% at 22% 65%, rgba(212,175,55,0.11) 0%, transparent 60%), radial-gradient(ellipse 55% 45% at 78% 35%, rgba(212,175,55,0.07) 0%, transparent 60%)" }}>
        <div className="max-w-7xl mx-auto">

          {/* Centered header — equal-weight features warrant centered framing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16 md:mb-20"
          >
            <span className="font-kiona text-[9px] text-black/35 block mb-6">WHY RYAN</span>
            <h2 className="text-[1.75rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[2.75rem] font-medium text-black leading-tight tracking-tight">
              A More Strategic<br />Lending Partner
            </h2>
          </motion.div>

          {/* Feature grid — 4 horizontal cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {(
              [
                {
                  title: "Deep SBA Expertise",
                  description:
                    "More than two decades of lending and business experience applied to real financing decisions.",
                  Icon: ExpertiseIcon,
                },
                {
                  title: "Clear Guidance",
                  description:
                    "Complex funding conversations simplified into practical next steps.",
                  Icon: GuidanceSmallIcon,
                },
                {
                  title: "Acquisition Insight",
                  description:
                    "Support that goes beyond loan placement, especially when a business purchase is involved.",
                  Icon: InsightIcon,
                },
                {
                  title: "Responsive Process",
                  description:
                    "Fast communication, honest feedback, and a client-first approach from first conversation to closing.",
                  Icon: ProcessSmallIcon,
                },
              ] as const
            ).map(({ title, description, Icon }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.025, y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={{
                  default: { duration: 0.6, delay: i * 0.09 },
                  scale: { type: "spring", stiffness: 260, damping: 22 },
                  y: { type: "spring", stiffness: 260, damping: 22 },
                }}
                viewport={{ once: true }}
                className="bg-white/[0.18] backdrop-blur-xl rounded-2xl border border-white/50 shadow-[0_4px_24px_rgba(0,0,0,0.06),_0_1px_2px_rgba(0,0,0,0.04),_inset_0_1px_0_rgba(255,255,255,0.92),_inset_0_-1px_0_rgba(0,0,0,0.04)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.1),_0_2px_4px_rgba(0,0,0,0.06),_inset_0_1px_0_rgba(255,255,255,0.92)] transition-shadow duration-300 cursor-pointer flex flex-col p-7 sm:p-8"
              >
                {/* Gray icon — no black box */}
                <div className="w-11 h-11 flex items-center justify-center mb-7 shrink-0">
                  <Icon className="w-[22px] h-[22px] text-black/30" />
                </div>

                {/* Feature number + title */}
                <div className="flex items-start gap-3 mb-4">
                  <span className="font-kiona text-[8px] text-black/22 mt-1 shrink-0 leading-none">
                    0{i + 1}
                  </span>
                  <h3 className="font-medium text-black text-[0.95rem] md:text-[1rem] leading-snug">
                    {title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-[13px] md:text-sm text-black/50 leading-relaxed pl-6">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Optional pull quote — "the client voice" */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-16 md:mt-20 flex flex-col sm:flex-row items-start sm:items-center gap-6 border-t border-black/8 pt-10"
          >
            {/* Gold rule */}
            <div className="w-8 h-px bg-[#D4AF37] shrink-0 mt-1 hidden sm:block" />
            <blockquote className="text-[0.9rem] md:text-[0.95rem] text-black/45 italic leading-relaxed font-light max-w-xl">
              "Extremely knowledgeable and passionate, Ryan is on top of his game."
            </blockquote>
            <span className="font-kiona text-[7.5px] text-black/25 sm:ml-auto shrink-0">
              CLIENT TESTIMONIAL
            </span>
          </motion.div>

        </div>
      </section>

      {/* Process Section — anti-gravity sticky scroll */}
      <ProcessSection />

      {/* Section bridge — Process cream descends naturally into BA black.
          Standalone element: zero z-index conflict, no content overlap. */}
      <div
        className="w-full h-28 sm:h-36 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 180% 70% at 50% 60%, rgba(0,0,0,0.12) 0%, transparent 100%), linear-gradient(to bottom, #F5F5F0 0%, #F5F5F0 5%, #e8e8e3 12%, #d0d0cb 22%, #a8a8a3 34%, #6a6a65 47%, #2d2d2a 60%, #0d0d0a 74%, #000000 88%)",
        }}
      />

      {/* Business Acquisition Section */}
      <BusinessAcquisitionSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* About Section */}
      <AboutSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Final CTA Section */}
      <FinalCTASection />

      {/* Footer */}
      <footer className="bg-black border-t border-white/[0.08] px-6 sm:px-10 lg:px-24 pt-16 md:pt-20 pb-8">

        {/* ── Main grid ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-14 border-b border-white/[0.06]">

          {/* Brand block */}
          <div className="sm:col-span-2 lg:col-span-1">
            <span className="font-kiona text-[13px] text-white tracking-[0.28em] block mb-4">
              RYAN KROGE
            </span>
            <p className="text-[13px] text-white/40 leading-relaxed mb-8 max-w-[220px]">
              SBA loan specialist and business acquisition consultant serving clients nationwide.
            </p>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-kiona text-[8px] text-white/35 hover:text-white/70 tracking-widest transition-colors duration-200"
            >
              LINKEDIN
            </a>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-kiona text-[8px] text-white/28 tracking-widest mb-7">
              NAVIGATION
            </p>
            <nav className="flex flex-col gap-4">
              {["Home", "About", "SBA Loans", "Business Acquisition", "Blog", "Contact"].map(
                (link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-[13px] text-white/45 hover:text-white/85 transition-colors duration-200 leading-none"
                  >
                    {link}
                  </a>
                )
              )}
            </nav>
          </div>

          {/* Services */}
          <div>
            <p className="font-kiona text-[8px] text-white/28 tracking-widest mb-7">
              SERVICES
            </p>
            <nav className="flex flex-col gap-4">
              {[
                "SBA 7(a) Loans",
                "Business Acquisition",
                "Partner Buyouts",
                "Equipment Financing",
                "Working Capital",
                "Strategic Guidance",
              ].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-[13px] text-white/45 hover:text-white/85 transition-colors duration-200 leading-none"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="font-kiona text-[8px] text-white/28 tracking-widest mb-7">
              CONTACT
            </p>
            <div className="flex flex-col gap-4">
              <a
                href="mailto:hello@ryankroge.com"
                className="text-[13px] text-white/45 hover:text-white/85 transition-colors duration-200 leading-none"
              >
                hello@ryankroge.com
              </a>
              <a
                href="tel:2483024032"
                className="text-[13px] text-white/45 hover:text-white/85 transition-colors duration-200 leading-none"
              >
                248-302-4032
              </a>
              <span className="text-[13px] text-white/45 leading-none">
                Detroit, Michigan
              </span>
              <span className="text-[13px] text-white/45 leading-none">
                Mon–Fri&nbsp;&nbsp;9:00AM – 5:00PM
              </span>
            </div>
          </div>

        </div>

        {/* ── Bottom bar ──────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8">
          <span className="font-kiona text-[8px] text-white/22 tracking-widest">
            © 2026 RYAN KROGE. ALL RIGHTS RESERVED.
          </span>
          <div className="flex items-center gap-6">
            <a href="#" className="font-kiona text-[8px] text-white/22 hover:text-white/50 tracking-widest transition-colors duration-200">
              PRIVACY POLICY
            </a>
            <a href="#" className="font-kiona text-[8px] text-white/22 hover:text-white/50 tracking-widest transition-colors duration-200">
              TERMS OF USE
            </a>
          </div>
        </div>

      </footer>

      {/* Side Label - Kiona Style */}
      <div className="fixed right-8 bottom-24 hidden lg:block">
        <span className="font-kiona text-[9px] text-white/20 vertical-text">
          EST. 2026 — FUNDING THE FUTURE
        </span>
      </div>
    </div>
  );
}
