import { motion } from "motion/react";
import { useEffect, useRef, ReactNode } from "react";
import { Phone, FileText, UserCheck, CheckCircle } from "lucide-react";
import heroImg from '@/photos/Ryan Kroge pics/expanded ryan .png';
import splitScreenImg from '@/photos/Ryan Kroge pics/Ryan_Kroge-21 BW-2.jpg';
import missionImg from '@/photos/Ryan Kroge pics/Ryan_Kroge-53 BW.jpg';

// Component to handle individual line scroll-scrubbed opacity using Vanilla JS
function RevealLine({ children, isSpace = false }: { children?: ReactNode, isSpace?: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate where the element is relative to the viewport height
      // rect.top is 0 at the top of the viewport, windowHeight at the bottom
      const progress = 1 - (rect.top / windowHeight);
      
      // progress goes from 0 (at bottom) to 1 (at top)
      
      let opacity = 0.15;
      
      // Start fading in at progress 0.2 (20% above bottom)
      // Fully opaque at progress 0.35
      // Stays opaque until progress 0.65
      // Fades out linearly, back to 0.15 at progress 0.8 (80% above bottom)
      if (progress >= 0.2 && progress <= 0.8) {
        if (progress < 0.35) {
          // Fade in [0.2 -> 0.35] maps to [0.15 -> 1]
          opacity = 0.15 + ((progress - 0.2) / 0.15) * 0.85; 
        } else if (progress < 0.65) {
          // Held opaque
          opacity = 1;
        } else {
          // Fade out [0.65 -> 0.8] maps to [1 -> 0.15]
          opacity = 1 - ((progress - 0.65) / 0.15) * 0.85;
        }
      }
      
      // Constrain opacity bounds cleanly
      el.style.opacity = Math.max(0.15, Math.min(1, opacity)).toString();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run once on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isSpace) {
    return <div className="h-8 sm:h-12 md:h-16 w-full" aria-hidden="true" />;
  }

  return (
    <p 
      ref={ref}
      style={{ opacity: 0.15, transition: "opacity 0.1s ease-out", willChange: "opacity" }}
      className="text-white text-[30px] font-medium leading-[1.25] tracking-tight text-center mx-auto max-w-5xl"
    >
      {children}
    </p>
  );
}

function WhoIAmSection() {
  return (
    <section 
      className="relative w-full z-10 bg-black px-6 py-20 sm:py-28 lg:py-32 flex flex-col items-center justify-center"
    >
      {/* Eyebrow Label (Centered) */}
      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="font-kiona text-[9px] sm:text-[10px] text-white tracking-[0.25em] font-medium mb-12 sm:mb-16 uppercase text-center"
      >
        WHO I AM
      </motion.h2>

      {/* Scroll-Triggered Text Reveal Content */}
      <div className="w-full flex flex-col items-center space-y-2 sm:space-y-4">
        <RevealLine>I'm Ryan Kroge. Small business</RevealLine>
        <RevealLine>lending specialist.</RevealLine>
        <RevealLine>Detroit-based, nationwide reach.</RevealLine>
        
        <RevealLine isSpace />
        
        <RevealLine>I don't push loans. I build deals —</RevealLine>
        <RevealLine>creative, well-structured deals that unlock</RevealLine>
        <RevealLine>money most business owners didn't</RevealLine>
        <RevealLine>think they could access.</RevealLine>
        
        <RevealLine isSpace />
        
        <RevealLine>I work with founders, operators,</RevealLine>
        <RevealLine>and buyers at every stage. Whether</RevealLine>
        <RevealLine>you're acquiring a business, expanding,</RevealLine>
        <RevealLine>or just tired of operating on fumes —</RevealLine>
        
        <RevealLine>I've seen your situation before, and</RevealLine>
        <RevealLine><span className="font-normal opacity-50">I know the path forward.</span></RevealLine>
      </div>
    </section>
  );
}

const WHY_CHOOSE_ME_CARDS = [
  {
    num: "01.",
    title: "I answer in 24 hours.",
    desc: "Yes or no. No \"we'll circle back.\" No radio silence for two weeks. You deserve to know where you stand — fast."
  },
  {
    num: "02.",
    title: "I've been doing this for 25+ years.",
    desc: "That's not a resume flex. That's pattern recognition. I've seen what works, what doesn't, and how to structure your deal so the lender can't say no."
  },
  {
    num: "03.",
    title: "I think like a lender, work like an advisor.",
    desc: "I'm on your side — but I know the other side of the table better than anyone. That perspective is worth more than any generic lending checklist."
  },
  {
    num: "04.",
    title: "I'm backed by an elite team.",
    desc: "SBA financing is complex. My team has seen every edge case, exception, and creative structure in the book. You're not getting one person's opinion — you're getting decades of collective expertise."
  },
  {
    num: "05.",
    title: "I'm backed by an elite team.",
    desc: "SBA financing is complex. My team has seen every edge case, exception, and creative structure in the book. You're not getting one person's opinion — you're getting decades of collective expertise."
  }
];

function WhyChooseMeSection() {
  return (
    <section className="relative w-full bg-black border-t border-white/[0.04]">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 lg:px-24 flex flex-col md:flex-row items-start relative">
        
        {/* Left Panel (Fixed/Sticky) */}
        <div className="md:w-[40%] md:sticky md:top-0 md:h-screen flex flex-col justify-center pt-20 pb-10 md:pt-0 md:pb-0 z-10 self-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <h3 className="font-kiona text-[9px] sm:text-[10px] text-white tracking-[0.25em] font-medium mb-6 sm:mb-8 uppercase">
              THE DIFFERENCE
            </h3>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-medium tracking-tight text-white leading-[1.05] max-w-sm">
              Why Owners Choose Me Over Every Other Banker.
            </h2>
            <div className="mt-10 sm:mt-12 overflow-hidden relative w-full max-w-[280px] sm:max-w-xs md:max-w-[320px] lg:max-w-sm aspect-[4/5] sm:aspect-square md:aspect-[4/3]">
              {/* Top seamless fade mask */}
              <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black via-black/60 to-transparent z-10 pointer-events-none" />
              
              <img 
                src={splitScreenImg} 
                alt="Ryan Kroge - The Difference" 
                className="object-cover object-center w-full h-full opacity-85 transition-opacity duration-700 hover:opacity-100" 
              />
              
              {/* Bottom seamless fade mask */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black via-black/60 to-transparent z-10 pointer-events-none" />
            </div>
          </motion.div>
        </div>

        {/* Right Panel (Scrolling Cards) */}
        <div className="md:w-[60%] flex flex-col pb-24 md:py-32 relative z-0">
          {WHY_CHOOSE_ME_CARDS.map((card, idx) => (
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
        </div>

      </div>
    </section>
  );
}

const FOUR_STEPS_DATA = [
  {
    num: "01",
    title: "The Discovery Call (30 min)",
    desc: "We talk about your business, your goals, and which loan type actually fits your situation. No fluff. Just a real conversation.",
    icon: Phone
  },
  {
    num: "02",
    title: "Tax Return Review",
    desc: "We pull your business and personal returns and figure out if you qualify. Honest assessment, no sugarcoating.",
    icon: FileText
  },
  {
    num: "03",
    title: "Personal Financial Form",
    desc: "We review your personal financial picture to confirm eligibility. If something's off, we tell you — and we tell you how to fix it.",
    icon: UserCheck
  },
  {
    num: "04",
    title: "Financial Statement Review",
    desc: "We verify the business can handle repayment. If you're ready, we move. If not, we map out what needs to happen.",
    icon: CheckCircle
  }
];

function FourStepsSection() {
  return (
    <section className="relative w-full bg-black py-24 sm:py-32 px-6 sm:px-10 lg:px-24 border-t border-white/[0.04]">
      {/* Description Header */}
      <div className="max-w-4xl mx-auto mb-16 sm:mb-24 text-center">
        <h3 className="font-kiona text-[9px] sm:text-[10px] text-white tracking-[0.25em] font-medium mb-6 uppercase">
          THE PROCESS
        </h3>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-medium tracking-tight text-white mb-6 leading-[1.05]">
          The 4-Step Path to Funded.
        </h2>
        <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
          No mystery. No bureaucratic black hole. Four steps. Clear answers. No wasted time on either side.
        </p>
      </div>

      {/* Stacking Cards Sticky Timeline */}
      <div className="max-w-4xl mx-auto flex flex-col relative pb-[15vh]">
        {FOUR_STEPS_DATA.map((step, index) => {
          const Icon = step.icon;
          // Dynamically compute the top offset so they stack sequentially like a deck of cards.
          // Leaving approximately an inch (40px) of the top edge showing for each previous card.
          const topOffset = `calc(15vh + ${index * 40}px)`;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="sticky w-full max-w-[260px] sm:max-w-[300px] md:max-w-[340px] mx-auto mb-16 sm:mb-20 md:mb-24 shadow-[20px_20px_60px_rgba(0,0,0,0.8),-10px_-10px_30px_rgba(255,255,255,0.02)] overflow-hidden rounded-none"
              style={{ 
                top: topOffset,
                zIndex: 10 + index 
              }}
            >
              {/* Card Container - Dark Smoked Glass */}
              <div className="bg-[#0a0a0a]/60 backdrop-blur-lg border border-white/[0.08] relative w-full p-6 sm:p-8 aspect-square flex flex-col justify-between overflow-hidden">
                
                {/* Premium Glass Light Interaction */}
                {/* Top Edge Highlight */}
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent z-20" />
                {/* Subtle Surface Shine */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none z-0" />
                
                <div className="relative z-10 flex flex-col h-full items-start justify-between">
                   {/* Number & Tiny Icon */}
                   <div className="flex items-center gap-2 sm:gap-3">
                     <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" strokeWidth={1.5} />
                     <span className="font-kiona text-[9px] sm:text-[10px] text-[#D4AF37] tracking-widest pt-0.5">{step.num}</span>
                   </div>
                   
                   {/* Text Content */}
                   <div className="flex flex-col w-full">
                     <h3 className="text-lg sm:text-xl text-white font-medium mb-1.5 sm:mb-2 tracking-tight leading-snug">
                       {step.title}
                     </h3>
                     <p className="text-white/60 text-xs sm:text-sm leading-relaxed max-w-full">
                       {step.desc}
                     </p>
                   </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function MissionSection() {
  return (
    <section className="relative w-full bg-black py-24 sm:py-32 px-6 sm:px-10 lg:px-24 border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
        
        {/* Left Column: Image Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
          className="relative w-full min-h-[400px] md:min-h-[500px] lg:min-h-full border border-white/[0.08] overflow-hidden group"
        >
          <img 
            src={missionImg} 
            alt="Ryan Kroge - The Mission" 
            className="w-full h-full object-cover grayscale opacity-90 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
          />
          {/* Subtle vignette/fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
        </motion.div>

        {/* Right Column: Content Boxes */}
        <div className="flex flex-col gap-8 md:gap-10">
          
          {/* Box 1: The Mission */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.2 }}
            className="bg-[#0a0a0a]/60 backdrop-blur-lg border border-white/[0.08] p-8 sm:p-10 flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
            <h3 className="font-kiona text-[10px] text-white tracking-[0.25em] font-medium mb-8 uppercase">
              THE MISSION
            </h3>
            <div className="flex flex-col gap-6">
              <p className="text-xl sm:text-2xl text-white font-medium leading-tight tracking-tight">
                Simple: Get your business funded. Help it grow. Repeat.
              </p>
              <p className="text-white/50 text-base sm:text-lg leading-relaxed font-light">
                Capital is the difference between a business that survives and one that scales. I've made it my life's work to make sure more small businesses get that shot.
              </p>
            </div>
          </motion.div>

          {/* Box 2: About Me + CTA */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, amount: 0.2 }}
            className="bg-[#0a0a0a]/60 backdrop-blur-lg border border-white/[0.08] p-8 sm:p-10 flex flex-col relative overflow-hidden flex-grow"
          >
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
            <h3 className="font-kiona text-[10px] text-white tracking-[0.25em] font-medium mb-8 uppercase">
              A BIT MORE ABOUT ME
            </h3>
            
            <div className="flex flex-col gap-6 mb-12">
              <p className="text-white/80 text-base sm:text-lg leading-relaxed italic border-l-2 border-[#D4AF37] pl-6 font-light">
                "I'm a family man. I know what it costs to waste someone's time — and I won't do it."
              </p>
              <p className="text-white/50 text-base leading-relaxed font-light">
                That's why everything I do is built around speed, honesty, and results. I don't do vague timelines. I don't do fluff. I give you a real answer, a real plan, and real support from a team that actually knows what they're doing.
              </p>
              <div className="flex flex-col gap-1">
                <p className="text-white font-medium text-lg tracking-tight">You're not a file number here.</p>
                <p className="text-white/60 text-base">You're a business owner with a real goal — and that matters.</p>
              </div>
            </div>

            {/* Integrated CTA Area */}
            <div className="mt-auto pt-10 border-t border-white/[0.05]">
              <div className="flex flex-col gap-6">
                <div>
                  <p className="font-kiona text-[9px] text-[#D4AF37] tracking-[0.2em] mb-4 uppercase">Let's find out if you qualify</p>
                  <a 
                    href="https://ryankroge.com/contact/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 text-white text-xl sm:text-2xl font-medium tracking-tight transition-opacity hover:opacity-80"
                  >
                    <span>Get Your Free Business Valuation</span>
                    <span className="text-[#D4AF37] group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </a>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 pt-2">
                  <div className="flex items-center gap-3 whitespace-nowrap">
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37]/60" />
                    <span className="text-white/70 text-base font-light tracking-wide">248-302-4032</span>
                  </div>
                  <div className="hidden sm:block w-[1px] h-3 bg-white/10" />
                  <div className="text-white/50 text-[10px] sm:text-xs font-light tracking-[0.1em] uppercase font-kiona whitespace-nowrap">
                    Mon–Fri · 9:00 AM – 5:00 PM EST
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default function About() {
  return (
    <div className="relative bg-black min-h-screen">
      {/* About Hero Section */}
      <section 
        className="relative w-full flex flex-col items-center justify-start pt-32 sm:pt-40 min-h-[90vh] md:min-h-[100vh] lg:min-h-[110vh]"
        id="about-hero"
      >
        {/* Hero Content - Sits clearly above the image */}
        <div className="relative z-30 px-6 text-center w-full max-w-4xl mx-auto flex flex-col items-center mb-0 sm:mb-2">
          <motion.span 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }} 
            className="font-kiona text-[9px] sm:text-[10px] text-white tracking-[0.25em] mb-6 block uppercase"
          >
            Small Business Lending Specialist
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }} 
            className="text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] font-medium text-white leading-[1.05] tracking-tight"
          >
            Hi, I’m Ryan.<br />
            I get small businesses funded
          </motion.h1>
        </div>

        {/* Image Container - Full width, closer to text, taller height to show more body */}
        <div className="relative z-10 w-full flex-grow flex flex-col justify-end items-center overflow-hidden -mt-8 sm:-mt-12 md:-mt-20 lg:-mt-24 pointer-events-none">
          <div className="relative w-full h-[85vh] sm:h-[95vh] md:h-[110vh] lg:h-[125vh]">
            <motion.img 
              src={heroImg} 
              alt="Ryan Kroge - Portrait" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 1.6, delay: 0.2, ease: "easeOut" }} 
              className="absolute inset-0 w-full h-full object-cover object-[50%_15%]" 
            />
            
            {/* Top fade: Full black at the top grading smoothly into the image */}
            <div className="absolute inset-x-0 top-0 h-40 sm:h-56 md:h-64 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none" />
            
            {/* Bottom fade: Smoothly fades into the solid black of the subsequent section */}
            <div className="absolute inset-x-0 bottom-0 h-32 sm:h-48 md:h-64 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Spacer before text reveal (Reduced to bring closer to the image) */}
      <div className="h-[10vh] sm:h-[15vh] w-full bg-black pointer-events-none" />

      {/* Scroll-Triggered Text Reveal Section */}
      <section className="relative w-full px-6 pt-20 pb-8 sm:pb-12 bg-black flex flex-col items-center justify-center">
        <div className="w-full flex flex-col items-center space-y-2 sm:space-y-4">
          <RevealLine>Most bankers hand you a pamphlet</RevealLine>
          <RevealLine>and wish you luck.</RevealLine>
          
          <RevealLine isSpace />
          
          <RevealLine>
            I've spent <span className="text-white font-normal">25 years on the inside,</span>
          </RevealLine>
          <RevealLine>I know exactly how lenders think,</RevealLine>
          <RevealLine>what they hate, and what makes</RevealLine>
          <RevealLine>them say yes without hesitation.</RevealLine>

          <RevealLine isSpace />

          <RevealLine>I use that knowledge to get you funded.</RevealLine>
        </div>
      </section>

      {/* Spacer after text reveal */}
      <div className="h-[8vh] sm:h-[12vh] w-full bg-black pointer-events-none" />

      {/* New Editorial 'Who I Am' Section */}
      <WhoIAmSection />
      
      {/* Scroll-Snap Sticky Split Screen Section */}
      <WhyChooseMeSection />
      
      {/* 4-Step Sticky Glassmorphism Stack */}
      <FourStepsSection />
      
      {/* New Mission / About / CTA Section */}
      <MissionSection />
      
    </div>
  );
}
