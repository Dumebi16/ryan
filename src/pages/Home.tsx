import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight, Plus } from "lucide-react";
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

// Business Acquisition icon
const AcquisitionIcon = ({ className }: { className?: string }) => {
  const dots: [number, number][] = [
    ...ringPts(64,  80, 52, 33),
    ...ringPts(64,  80, 32, 20),
    ...ringPts(116, 80, 52, 33),
    ...ringPts(116, 80, 32, 20),
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

// Strategic Financial Guidance icon
const GuidanceIcon = ({ className }: { className?: string }) => {
  const [cx, cy, r] = [90, 80, 70];
  const outer = ringPts(cx, cy, r, 44);
  const arc = (yShift: number, xShift: number): [number, number][] =>
    Array.from({ length: 20 }, (_, i) => {
      const t = i / 19;
      const x = 24 + xShift + t * 132;
      const y = 142 + yShift - Math.pow(t, 1.15) * 120;
      return [+x.toFixed(1), +y.toFixed(1)] as [number, number];
    }).filter(([px, py]) => (px - cx) ** 2 + (py - cy) ** 2 <= (r - 4) ** 2);

  const dots: [number, number][] = [ ...outer, ...arc(0, 0), ...arc(-15, 2), ...arc(15, -2) ];
  return (
    <svg viewBox="0 0 180 160" fill="currentColor" className={className} aria-hidden="true">
      {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.85} />)}
    </svg>
  );
};

// --- Feature icons ---
const ExpertiseIcon = ({ className }: { className?: string }) => {
  const dots: [number, number][] = [ ...ringPts(16, 16, 11, 10), ...ringPts(16, 16, 6, 7), [16, 16] ];
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" className={className ?? "w-[22px] h-[22px]"}>
      {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.6} />)}
    </svg>
  );
};

const GuidanceSmallIcon = ({ className }: { className?: string }) => {
  const shaft: [number, number][] = Array.from({ length: 6 }, (_, i) => [5 + i * 3.1, 16] as [number, number]);
  const head: [number, number][] = [[20, 11.5], [22.5, 14], [24, 16], [22.5, 18], [20, 20.5]];
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" className={className ?? "w-[22px] h-[22px]"}>
      {[...shaft, ...head].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.6} />)}
    </svg>
  );
};

const InsightIcon = ({ className }: { className?: string }) => {
  const lens = ringPts(13.5, 13.5, 8.5, 12);
  const handle: [number, number][] = [[19.5, 19.5], [21.5, 21.5], [23.5, 23.5]];
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" className={className ?? "w-[22px] h-[22px]"}>
      {[...lens, ...handle].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.6} />)}
    </svg>
  );
};

const ProcessSmallIcon = ({ className }: { className?: string }) => {
  const arc = Array.from({ length: 16 }, (_, i): [number, number] => {
    const a = -Math.PI / 2 + (i / 15) * (1.72 * Math.PI);
    return [+(16 + 11 * Math.cos(a)).toFixed(1), +(16 + 11 * Math.sin(a)).toFixed(1)];
  });
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

// --- Step Icons ---
const DiscoveryIcon = ({ className }: { className?: string }) => {
  const leftArc = Array.from({ length: 14 }, (_, i): [number, number] => {
    const a = -Math.PI / 2 + (i / 13) * Math.PI;
    return [+(44 + 30 * Math.cos(a)).toFixed(1), +(50 + 30 * Math.sin(a)).toFixed(1)];
  });
  const rightArc = Array.from({ length: 14 }, (_, i): [number, number] => {
    const a = Math.PI / 2 + (i / 13) * Math.PI;
    return [+(116 + 30 * Math.cos(a)).toFixed(1), +(50 + 30 * Math.sin(a)).toFixed(1)];
  });
  const dots: [number, number][] = [ ...leftArc, ...rightArc, ...ringPts(44, 50, 16, 9), ...ringPts(116, 50, 16, 9) ];
  return (
    <svg viewBox="0 0 160 100" fill="currentColor" className={className} aria-hidden="true">
      {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.8} />)}
    </svg>
  );
};

const ReviewIcon = ({ className }: { className?: string }) => {
  const rows = [ { y: 18, end: 140 }, { y: 34, end: 108 }, { y: 50, end: 130 }, { y: 66, end: 95 }, { y: 82, end: 118 } ];
  const dots: [number, number][] = rows.flatMap(({ y, end }) =>
    Array.from({ length: Math.floor((end - 20) / 9) + 1 }, (_, i): [number, number] => [20 + i * 9, y])
  );
  return (
    <svg viewBox="0 0 160 100" fill="currentColor" className={className} aria-hidden="true">
      {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.8} />)}
    </svg>
  );
};

const StrategyIcon = ({ className }: { className?: string }) => {
  const trunk: [number, number][] = Array.from({ length: 5 }, (_, i) => [80, 12 + i * 10] as [number, number]);
  const branch = (tx: number): [number, number][] =>
    Array.from({ length: 5 }, (_, i) => {
      const t = (i + 1) / 5;
      return [+(80 + t * (tx - 80)).toFixed(1), +(62 + t * 26).toFixed(1)] as [number, number];
    });
  const dots: [number, number][] = [ ...trunk, [80, 62], ...branch(28), ...branch(80), ...branch(132) ];
  return (
    <svg viewBox="0 0 160 100" fill="currentColor" className={className} aria-hidden="true">
      {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.8} />)}
    </svg>
  );
};

const FundingIcon = ({ className }: { className?: string }) => {
  const arc = Array.from({ length: 17 }, (_, i): [number, number] => {
    const t = i / 16;
    return [+(18 + t * 118).toFixed(1), +(88 - Math.pow(t, 1.2) * 72).toFixed(1)];
  });
  const dots: [number, number][] = [ ...arc, ...ringPts(136, 16, 12, 10), ...ringPts(136, 16, 5, 6), [136, 16] ];
  return (
    <svg viewBox="0 0 160 100" fill="currentColor" className={className} aria-hidden="true">
      {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.8} />)}
    </svg>
  );
};

const PROCESS_STEPS = [
  { num: "01", title: "Discovery Call", body: "Discuss the business, the opportunity, the funding need, and the timeline.", Icon: DiscoveryIcon },
  { num: "02", title: "Qualification Review", body: "Review key documents such as tax returns, financial statements, and ownership details.", Icon: ReviewIcon },
  { num: "03", title: "Loan Strategy", body: "Align the opportunity with the right SBA structure and lender expectations.", Icon: StrategyIcon },
  { num: "04", title: "Move to Funding", body: "Advance with a clear path toward approval, closing, and capital access.", Icon: FundingIcon },
];

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
      <section className="lg:hidden relative bg-[#F5F5F0] border-t border-black/8 px-6 sm:px-10 pt-20 pb-20" style={{ backgroundImage: "radial-gradient(ellipse 65% 55% at 22% 65%, rgba(212,175,55,0.14) 0%, transparent 60%), radial-gradient(ellipse 55% 45% at 78% 35%, rgba(212,175,55,0.09) 0%, transparent 60%)" }}>
        <div className="mb-14">
          <span className="font-kiona text-[9px] text-black/35 block mb-6">PROCESS</span>
          <h2 className="text-[1.75rem] sm:text-[2rem] font-medium text-black leading-tight tracking-tight mb-5">A Clear Path<br />to Funding</h2>
          <p className="text-sm text-black/50 leading-relaxed max-w-xs">The process is designed to move quickly while giving you real clarity on what is possible and what comes next.</p>
        </div>
        <div className="flex flex-col divide-y divide-black/8">
          {PROCESS_STEPS.map((step) => (
            <div key={step.num} className="py-10">
              <div className="flex items-start gap-4 mb-4">
                <span className="font-kiona text-[8px] text-black/30 shrink-0 pt-[3px]">STEP {step.num}</span>
                <h3 className="text-[1.5rem] sm:text-[1.75rem] font-medium text-black leading-tight tracking-tight">{step.title}</h3>
              </div>
              <p className="text-sm text-black/50 leading-relaxed mb-8 pl-[52px] max-w-[280px]">{step.body}</p>
              <step.Icon className="w-full max-w-[160px] text-black/14" />
            </div>
          ))}
        </div>
      </section>
      <section id="process" className="hidden lg:flex relative bg-[#F5F5F0] border-t border-black/8 h-screen overflow-hidden" style={{ backgroundImage: "radial-gradient(ellipse 65% 55% at 22% 65%, rgba(212,175,55,0.14) 0%, transparent 60%), radial-gradient(ellipse 55% 45% at 78% 35%, rgba(212,175,55,0.09) 0%, transparent 60%)" }}>
        <div className="shrink-0 w-[42%] flex flex-col justify-center pl-24 pr-10 z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
            <span className="font-kiona text-[9px] text-black/35 block mb-6">PROCESS</span>
            <h2 className="text-[1.75rem] md:text-[2rem] xl:text-[2.5rem] font-medium text-black leading-tight tracking-tight mb-5">A Clear Path<br />to Funding</h2>
            <p className="text-sm md:text-[15px] text-black/50 leading-relaxed mb-10 max-w-xs">The process is designed to move quickly while giving you real clarity on what is possible and what comes next.</p>
          </motion.div>
          <div className="flex flex-col gap-4">
            {PROCESS_STEPS.map((s, i) => (
              <div key={s.num} className="flex items-center gap-3.5">
                <div className="rounded-full transition-all duration-500 shrink-0" style={{ width: i === activeStep ? "20px" : "7px", height: "7px", backgroundColor: i === activeStep ? "#D4AF37" : i < activeStep ? "rgba(0,0,0,0.32)" : "rgba(0,0,0,0.14)" }} />
                <span className="font-kiona text-[8px] transition-all duration-500" style={{ color: i === activeStep ? "rgba(0,0,0,0.68)" : i < activeStep ? "rgba(0,0,0,0.33)" : "rgba(0,0,0,0.2)" }}>{s.num} — {s.title}</span>
              </div>
            ))}
          </div>
        </div>
        <div ref={rightColRef} className="flex-1 h-full overflow-y-scroll" style={{ scrollbarWidth: "none" } as any}>
          <div className="relative w-full" style={{ height: `${PROCESS_STEPS.length * 100}vh` }}>
            <div className="sticky top-0 h-screen relative">
              <AnimatePresence mode="sync" initial={false}>
                {(() => {
                  const step = PROCESS_STEPS[activeStep];
                  const { Icon } = step;
                  return (
                    <motion.div key={activeStep} initial={{ opacity: 0, y: stepDir * 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: stepDir * -16, transition: { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] } }} transition={{ duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }} className="absolute inset-0 flex flex-col items-center justify-center will-change-transform px-6">
                      <div className="w-full max-w-sm">
                        <span className="font-kiona text-[8px] block mb-5 text-center text-black/75">STEP {step.num}</span>
                        <h3 className="text-[1.75rem] sm:text-[2rem] md:text-[2.25rem] font-medium leading-tight tracking-tight mb-4 text-center text-black">{step.title}</h3>
                        <p className="text-sm leading-relaxed mb-10 text-center max-w-[260px] mx-auto text-black/80">{step.body}</p>
                        <div><Icon className="w-full max-w-[200px] mx-auto text-black/40" /></div>
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

const TESTIMONIALS = [
  { quote: "Ryan Kroge successfully closed a $5.3MM SBA loan for my buyer in 85 days. Despite challenges with multiple sellers, three physical locations, and three different landlords, Ryan was persistent and contributed to various bank teams to make it happen.", author: "Jackie Ossin", role: "Business Broker", initials: "JO" },
  { quote: "Ryan is a top-notch banker for SBA Loans and an asset for any business broker. He prioritizes completing deals for his clients and has a skilled team supporting him. Thanks to his creativity and determination, we have successfully closed numerous deals together.", author: "Nadir Jiddou", role: "Business Broker", initials: "NJ" },
  { quote: "Ryan took the complexity out of the SBA process and helped us close a deal we were not sure would get done. His understanding of lender expectations and deal structure made all the difference from start to finish.", author: "David Park", role: "Business Buyer", initials: "DP" },
];

const TestimonialsSection = () => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const handleChange = (index: number) => { if (index === active) return; setDirection(index > active ? 1 : -1); setActive(index); };
  const handlePrev = () => handleChange(active === 0 ? TESTIMONIALS.length - 1 : active - 1);
  const handleNext = () => handleChange(active === TESTIMONIALS.length - 1 ? 0 : active + 1);
  const current = TESTIMONIALS[active];
  return (
    <section id="testimonials" className="bg-black border-t border-white/[0.06] px-6 sm:px-10 lg:px-24 pt-24 md:pt-32 pb-28 md:pb-40">
      <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true, amount: 0.3 }} className="font-kiona text-[9px] text-white/30 block mb-16 md:mb-20 tracking-widest">CLIENT RESULTS</motion.span>
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08 }} viewport={{ once: true, amount: 0.2 }} className="flex items-start gap-6 md:gap-12 max-w-4xl" >
        <AnimatePresence mode="wait">
          <motion.span key={`num-${active}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="text-[72px] md:text-[112px] font-light leading-none text-white/[0.06] select-none shrink-0 tabular-nums" style={{ fontFeatureSettings: '"tnum"' }}>{String(active + 1).padStart(2, "0")}</motion.span>
        </AnimatePresence>
        <div className="flex-1 pt-3 md:pt-6 min-w-0">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.blockquote key={`quote-${active}`} custom={direction} initial={{ opacity: 0, x: direction * 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: direction * -14 }} transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }} className="text-[1.2rem] sm:text-[1.45rem] md:text-[1.6rem] font-light text-white/80 leading-relaxed tracking-tight mb-10">&ldquo;{current.quote}&rdquo;</motion.blockquote>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div key={`author-${active}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22, delay: 0.08 }} className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full border border-white/12 flex items-center justify-center shrink-0"><span className="font-kiona text-[8px] text-white/40 tracking-widest">{current.initials}</span></div>
              <div><p className="text-[14px] font-medium text-white/85 leading-tight">{current.author}</p><p className="font-kiona text-[7px] text-white/30 tracking-widest mt-1">{current.role.toUpperCase()}</p></div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true, amount: 0.3 }} className="flex items-center justify-between max-w-4xl mt-16 md:mt-20">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => handleChange(i)} className="group py-4"><span className={`block h-px transition-all duration-500 ease-out ${i === active ? "w-12 bg-[#D4AF37]" : "w-6 bg-white/[0.18] group-hover:w-9 group-hover:bg-white/[0.38]"}`} /></button>
            ))}
          </div>
          <span className="font-kiona text-[8px] text-white/22 tracking-widest">{String(active + 1).padStart(2, "0")} / {String(TESTIMONIALS.length).padStart(2, "0")}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handlePrev} className="p-2.5 text-white/30 hover:text-white/70 transition-colors duration-200"><ChevronLeft size={18} strokeWidth={1.5} /></button>
          <button onClick={handleNext} className="p-2.5 text-white/30 hover:text-white/70 transition-colors duration-200"><ChevronRight size={18} strokeWidth={1.5} /></button>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.25 }} viewport={{ once: true, amount: 0.3 }} className="mt-14 md:mt-16 max-w-4xl">
        <button className="font-kiona text-[11px] border border-white/20 text-white px-10 py-4 hover:bg-white hover:text-black hover:border-white transition-all duration-300 inline-flex items-center gap-3">VIEW MORE RECOMMENDATIONS <ArrowRight size={12} strokeWidth={1.5} /></button>
      </motion.div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <section id="about" className="bg-black px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
      <div className="border border-white/[0.1] overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[72vh]">
          <div className="relative w-full h-[72vw] sm:h-[56vw] lg:h-auto lg:w-[44%] overflow-hidden shrink-0">
            <img src={ryanLaptopImg} alt="Ryan Kroge — SBA Loan Specialist" className="absolute inset-0 w-full h-full object-cover object-center grayscale" />
            <span className="absolute bottom-6 left-6 font-kiona text-[7px] text-white/40 tracking-widest">DETROIT, MI</span>
          </div>
          <div className="flex-1 flex flex-col justify-between px-8 sm:px-12 lg:px-16 xl:px-20 py-12 lg:py-14 border-t lg:border-t-0 lg:border-l border-white/[0.08]">
            <p className="font-kiona text-[8px] text-white/28 tracking-[0.22em]">RYAN KROGE&nbsp;&nbsp;·&nbsp;&nbsp;SBA LOAN SPECIALIST</p>
            <div className="flex-1 flex flex-col justify-center py-12 lg:py-0 max-w-lg">
              <motion.span initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true, amount: 0.3 }} className="font-kiona text-[9px] text-white/35 block mb-7 tracking-widest">ABOUT RYAN</motion.span>
              <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.07 }} viewport={{ once: true, amount: 0.3 }} className="text-[1.75rem] sm:text-[2rem] lg:text-[2.25rem] font-medium text-white leading-tight tracking-tight mb-7">Experienced Guidance for High-Stakes Business Decisions</motion.h2>
              <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.14 }} viewport={{ once: true, amount: 0.3 }} className="text-[15px] text-white/50 leading-relaxed mb-10">Ryan Kroge is an SBA loan specialist and business acquisition consultant based in Detroit and serving clients nationwide. With more than 25 years of lending and business experience, he helps business owners move through financing decisions with confidence, strategy, and a clear understanding of the path ahead.</motion.p>
              <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true, amount: 0.3 }}>
                <button className="font-kiona text-[11px] border border-white/20 text-white px-10 py-4 hover:bg-white hover:text-black hover:border-white transition-all duration-300 inline-flex items-center gap-3">LEARN MORE ABOUT RYAN <ArrowRight size={12} strokeWidth={1.5} /></button>
              </motion.div>
            </div>
            <div className="flex items-end justify-between pt-10 border-t border-white/[0.08]">
              <div><p className="text-[2rem] font-light text-white leading-none mb-1">25+</p><p className="font-kiona text-[7px] text-white/30 tracking-widest">YEARS EXPERIENCE</p></div>
              <div className="text-right"><p className="text-[2rem] font-light text-white leading-none mb-1">100+</p><p className="font-kiona text-[7px] text-white/30 tracking-widest">BUSINESSES HELPED</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FAQ_ITEMS = [
  { question: "What types of businesses do you help?", answer: "Ryan works with business owners across most industries — from service businesses and franchises to manufacturing and professional practices." },
  { question: "How long does SBA financing usually take?", answer: "Most SBA transactions move to closing in 60 to 90 days from a complete application." },
  { question: "What do I need to qualify?", answer: "Lenders typically evaluate business financials, personal credit, industry experience, and the overall strength of the opportunity." },
  { question: "Can you help with business acquisitions?", answer: "Yes. Business acquisition is a core focus. Ryan guides buyers through the full SBA financing process." },
];

const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="bg-[#080808] border-t border-white/[0.07] px-6 sm:px-10 lg:px-24 py-20 md:py-28">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-20">
        <div className="lg:w-[28%] shrink-0">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} viewport={{ once: true, amount: 0.3 }}>
            <span className="font-kiona text-[9px] text-white/30 block mb-6 tracking-widest">FAQ</span>
            <h2 className="text-[1.75rem] sm:text-[2rem] font-medium text-white/90 leading-tight tracking-tight mb-8">Common Questions</h2>
            <button className="font-kiona text-[11px] border border-white/20 text-white/75 px-8 py-3.5 hover:bg-white/[0.07] hover:border-white/35 hover:text-white transition-all duration-300 inline-flex items-center gap-3">CONTACT RYAN <ArrowRight size={12} strokeWidth={1.5} /></button>
          </motion.div>
        </div>
        <div className="flex-1 border-t border-white/[0.10]">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="border-b border-white/[0.10]">
              <button onClick={() => setOpen(open === i ? null : i)} className="group w-full flex items-start justify-between gap-6 py-6 text-left cursor-pointer px-2 transition-all duration-300">
                <span className="text-[1rem] md:text-[1.05rem] font-medium text-white/85 leading-snug group-hover:text-white/95 transition-colors duration-300">{item.question}</span>
                <span className={`shrink-0 mt-0.5 text-white/35 group-hover:text-white/55 transition-all duration-300 ease-out ${open === i ? "rotate-45" : "rotate-0"}`}><Plus size={16} strokeWidth={1.5} /></span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32 }} className="overflow-hidden">
                    <p className="pb-7 text-[15px] text-white/45 leading-relaxed max-w-xl">{item.answer}</p>
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

const BusinessAcquisitionSection = () => (
  <section id="business-acquisition" className="relative bg-black overflow-hidden pb-28 md:pb-40">
    <div className="absolute inset-x-0 bottom-0 h-[70%] pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 80%, rgba(212,175,55,0.04) 0%, transparent 100%)" }} />
    <div className="relative z-10 px-6 sm:px-10 lg:px-24 pt-16 md:pt-24 max-w-4xl mx-auto text-center">
      <span className="font-kiona text-[9px] text-white/30 block mb-10 md:mb-12 tracking-widest">BUSINESS ACQUISITION</span>
      <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true, amount: 0.3 }} className="text-[2.25rem] sm:text-[3rem] md:text-[3.75rem] font-medium text-white leading-[1.08] tracking-tight mb-8 md:mb-10">Buying a Business Starts With the Right Financing Strategy</motion.h2>
      <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1 }} viewport={{ once: true, amount: 0.3 }} className="text-[15px] md:text-base text-white/45 leading-relaxed mb-12 md:mb-14 max-w-sm mx-auto">More than approval — Ryan helps buyers understand structure, liquidity, and lender expectations so every deal moves forward with confidence.</motion.p>
      <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.18 }} viewport={{ once: true, amount: 0.3 }}>
        <button className="font-kiona text-[11px] border border-white/20 text-white px-10 py-4 hover:bg-white hover:text-black hover:border-white transition-all duration-300 inline-flex items-center gap-3">EXPLORE BUSINESS ACQUISITION <ArrowRight size={12} strokeWidth={1.5} /></button>
      </motion.div>
    </div>
  </section>
);

const FinalCTASection = () => (
  <section id="contact" className="relative bg-black overflow-hidden px-6 sm:px-10 py-28 md:py-40">
    <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 55% at 50% 55%, rgba(212,175,55,0.07) 0%, transparent 70%)" }} />
    <div className="relative z-10 max-w-2xl mx-auto text-center">
      <motion.div initial={{ opacity: 0, scaleX: 0.4 }} whileInView={{ opacity: 1, scaleX: 1 }} transition={{ duration: 0.55 }} viewport={{ once: true, amount: 0.4 }} className="flex items-center justify-center gap-2.5 mb-10"><span className="block h-px w-8 bg-white/50" /><span className="block w-1.5 h-1.5 rounded-full bg-white/70" /><span className="block h-px w-8 bg-white/50" /></motion.div>
      <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true, amount: 0.4 }} className="font-kiona text-[9px] text-white/30 block mb-8 tracking-widest">GET STARTED</motion.span>
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true, amount: 0.4 }} className="text-[2.25rem] sm:text-[3rem] md:text-[3.75rem] font-medium text-white leading-[1.08] tracking-tight mb-7">Ready to Explore Your Funding Options?</motion.h2>
      <motion.p initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} viewport={{ once: true, amount: 0.4 }} className="text-[15px] md:text-base text-white/45 leading-relaxed mb-12 max-w-md mx-auto">Whether you are acquiring a business, preparing for growth, or evaluating SBA financing, Ryan can help you understand the next move.</motion.p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button className="font-kiona text-[11px] bg-[#D4AF37] text-white px-10 py-4 hover:bg-white hover:text-black transition-colors duration-300 inline-flex items-center gap-3 w-full sm:w-auto justify-center">START YOUR APPLICATION <ArrowRight size={12} strokeWidth={1.5} /></button>
        <button className="font-kiona text-[11px] border border-white/20 text-white px-10 py-4 hover:bg-white hover:text-black hover:border-white transition-all duration-300 inline-flex items-center gap-3 w-full sm:w-auto justify-center">BOOK A CALL</button>
      </div>
    </div>
  </section>
);

export default function Home() {
  return (
    <>
      <div className="absolute top-0 left-0 right-0 h-screen z-0 overflow-hidden">
        <motion.img src="https://imagedelivery.net/0vuc79pYCDCfiNfFkSs8YA/74d0e1be-90ed-478d-c169-8e4752da2900/public" alt="" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6 }} className="absolute inset-0 w-full h-full object-cover object-center md:object-right md:translate-x-[4%] md:scale-[1.04]" />
        <div className="absolute inset-0 hidden md:block" style={{ background: "linear-gradient(to right, #000000 18%, rgba(0,0,0,0.85) 36%, rgba(0,0,0,0.15) 68%, transparent 100%)" }} />
        <div className="absolute inset-0 bg-black/52 md:hidden" />
        <div className="absolute inset-x-0 top-0 h-40" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.65), transparent)" }} />
        <div className="absolute inset-x-0 bottom-0 h-52 sm:h-60 md:h-72" style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(245,245,240,0.55) 58%, #F5F5F0 100%)" }} />
      </div>

      <main className="relative flex flex-col items-start justify-center min-vh-screen px-6 sm:px-10 md:px-16 lg:px-24 pt-24 pb-32 max-w-7xl z-10 min-h-screen">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-[28px] sm:text-[32px] md:text-[40px] font-medium leading-tight mb-6 tracking-tight">Get the <span className="text-primary italic">Capital</span> to <br className="hidden sm:block" />Scale Your Business Fast.</motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-sm sm:text-base md:text-lg text-white/70 max-w-lg font-normal leading-relaxed mb-10">Ryan Kroge makes SBA loans simple. We cut through the bank jargon to deliver the funding your vision deserves.</motion.p>
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
          <button className="w-full sm:w-auto font-kiona text-[11px] bg-white text-black px-8 py-4 border border-white transition-all duration-300 hover:bg-transparent hover:text-white">START YOUR APPLICATION</button>
          <button className="font-kiona text-[11px] text-white/80 hover:text-primary transition-colors tracking-[0.3em] py-2 text-center w-full sm:w-auto">EXPLORE SERVICES</button>
        </div>
      </main>

      <section className="relative z-10 bg-[#F5F5F0] py-20 md:py-24 px-6 md:px-16 lg:px-24" style={{ 
        backgroundImage: `radial-gradient(ellipse 65% 55% at 22% 65%, rgba(212,175,55,0.11) 0%, transparent 60%), radial-gradient(ellipse 55% 45% at 78% 35%, rgba(212,175,55,0.07) 0%, transparent 60%), url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23000' stroke-opacity='0.02' stroke-width='0.5'%3E%3Cpath d='M36 34v-1h-1v1h1zm1 0h1v1h-1v-1zm-1 1h1v1h-1v-1zM37 34v1h-1v-1h1zm1 1v1h-1v-1h1zM34 36h1v1h-1v-1zm0-1h1v1h-1v-1zm1 0h1v1h-1v-1z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
      }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-14 md:gap-20 items-start">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
              <h2 className="text-[1.75rem] sm:text-[2rem] md:text-[2.5rem] font-medium text-black leading-tight tracking-tight mb-5">A More Strategic<br />Lending Partner</h2>
              <p className="text-sm md:text-[15px] text-black/55 leading-relaxed max-w-sm">Ryan Kroge is an SBA loan specialist and business acquisition consultant serving clients nationwide. With more than 25 years of lending experience, he helps business owners move through financing decisions with confidence and clarity.</p>
            </motion.div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-10">
              {[ { value: "25+", label: "Years Experience" }, { value: "1000+", label: "Businesses Helped" }, { value: "24 Hours", label: "Initial Qualification Guidance" }, { value: "$500K–$10M", label: "Typical Loan Range" }, { value: "Nationwide", label: "Lending Support" } ].map(({ value, label }, i) => (
                <motion.div key={label} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.07 }} viewport={{ once: true }} className="flex flex-col"><span className="text-[2.25rem] sm:text-[2.75rem] md:text-[3.25rem] font-medium text-black leading-none">{value}</span><span className="font-kiona text-[8px] text-black/40 mt-3 uppercase">{label}</span></motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="sba-loans" className="bg-[#F5F5F0]">
        <div id="services" className="relative z-10 bg-[#F5F5F0] py-20 md:py-28 px-6 sm:px-10 md:px-16 lg:px-24" style={{ backgroundImage: "radial-gradient(ellipse 65% 55% at 22% 65%, rgba(212,175,55,0.14) 0%, transparent 60%), radial-gradient(ellipse 55% 45% at 78% 35%, rgba(212,175,55,0.09) 0%, transparent 60%)" }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-16 lg:mb-20">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }} className="max-w-2xl">
                <span className="font-kiona text-[9px] text-black/35 block mb-6">CAPABILITIES</span>
                <h2 className="text-[1.75rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[2.75rem] font-medium text-black leading-tight tracking-tight mb-5">Strategic Funding Solutions<br className="hidden lg:block" /> for Growth, Acquisition,<br className="hidden lg:block" /> and Long-Term Success</h2>
                <p className="text-sm md:text-[15px] text-black/50 leading-relaxed max-w-lg">Ryan works with business owners who need more than a loan product. He provides financing guidance, deal support, and strategic insight tailored to the stage and structure of the opportunity.</p>
              </motion.div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {[
                { title: "SBA Loans", tag: "SBA 7(a) & 504", description: "Funding solutions for acquisitions, expansion, partner buyouts, equipment, and working capital.", Icon: SBALoansIcon },
                { title: "Business Acquisition", tag: "Buy-Side Advisory", description: "Guidance for buyers navigating valuation, structure, lender expectations, and the financing process.", Icon: AcquisitionIcon },
                { title: "Strategic Financial Guidance", tag: "Deal Strategy", description: "Clarity around loan readiness, financial positioning, and the decisions that shape a stronger funding outcome.", Icon: GuidanceIcon }
              ].map(({ title, tag, description, Icon }, i) => (
                <motion.div key={title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.025, y: -4 }} transition={{ duration: 0.6, delay: i * 0.1 }} viewport={{ once: true }} className="bg-white/[0.18] backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm p-7 sm:p-9 sm:min-h-[440px]">
                  <div className="flex items-start justify-between mb-6 min-h-[3.5rem]"><h3 className="font-medium text-[1rem] text-black">{title}</h3><span className="font-kiona text-[7px] text-black/28 uppercase">{tag}</span></div>
                  <div className="flex-1 flex items-center justify-center py-4"><Icon className="w-full max-w-[180px] text-black/18" /></div>
                  <div className="mt-auto pt-6 border-t border-black/8"><p className="text-[13px] text-black/55">{description}</p><div className="flex items-center gap-2 mt-5"><span className="font-kiona text-[8px] text-black/32 uppercase">LEARN MORE</span><ArrowRight size={10} className="text-black/32" /></div></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F0] border-t border-black/8 py-20 md:py-28 px-6 sm:px-10 md:px-16 lg:px-24" style={{ 
        backgroundImage: `radial-gradient(ellipse 65% 55% at 22% 65%, rgba(212,175,55,0.11) 0%, transparent 60%), radial-gradient(ellipse 55% 45% at 78% 35%, rgba(212,175,55,0.07) 0%, transparent 60%), url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23000' stroke-opacity='0.02' stroke-width='0.5'%3E%3Cpath d='M36 34v-1h-1v1h1zm1 0h1v1h-1v-1zm-1 1h1v1h-1v-1zM37 34v1h-1v-1h1zm1 1v1h-1v-1h1zM34 36h1v1h-1v-1zm0-1h1v1h-1v-1zm1 0h1v1h-1v-1z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
      }}>
        <div className="max-w-7xl mx-auto text-center mb-16 md:mb-20">
          <span className="font-kiona text-[9px] text-black/35 block mb-6">WHY RYAN</span>
          <h2 className="text-[1.75rem] sm:text-[2rem] md:text-[2.5rem] font-medium text-black">A More Strategic Lending Partner</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {[
            { title: "Deep SBA Expertise", description: "More than two decades of lending and business experience applied to real financing decisions.", Icon: ExpertiseIcon },
            { title: "Clear Guidance", description: "Complex funding conversations simplified into practical next steps.", Icon: GuidanceSmallIcon },
            { title: "Acquisition Insight", description: "Support that goes beyond loan placement, especially when a business purchase is involved.", Icon: InsightIcon },
            { title: "Responsive Process", description: "Fast communication, honest feedback, and a client-first approach from first conversation to closing.", Icon: ProcessSmallIcon }
          ].map(({ title, description, Icon }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.09 }} viewport={{ once: true }} className="bg-white/[0.18] backdrop-blur-xl rounded-2xl border border-white/50 p-7 shadow-sm">
              <div className="w-11 h-11 flex items-center justify-center mb-7"><Icon className="w-[22px] h-[22px] text-black/30" /></div>
              <div className="flex items-start gap-3 mb-4"><span className="font-kiona text-[8px] text-black/22 mt-1">0{i + 1}</span><h3 className="font-medium text-black text-[0.95rem]">{title}</h3></div>
              <p className="text-[13px] text-black/50 pl-6">{description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <ProcessSection />

      <div className="w-full h-28 sm:h-36" style={{ background: "linear-gradient(to bottom, #F5F5F0 0%, #000000 100%)" }} />

      <BusinessAcquisitionSection />
      <TestimonialsSection />
      <AboutSection />
      <FAQSection />
      <FinalCTASection />
    </>
  );
}
