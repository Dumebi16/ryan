import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, Phone, Clock } from "lucide-react";

export default function About() {
  return (
    <div 
      className="bg-secondary min-h-screen pt-32 pb-24 px-6 sm:px-10 lg:px-24 relative overflow-hidden"
      style={{ 
        backgroundImage: `radial-gradient(ellipse 65% 55% at 22% 65%, rgba(212,175,55,0.11) 0%, transparent 60%), radial-gradient(ellipse 55% 45% at 78% 35%, rgba(212,175,55,0.07) 0%, transparent 60%), url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23000' stroke-opacity='0.02' stroke-width='0.5'%3E%3Cpath d='M36 34v-1h-1v1h1zm1 0h1v1h-1v-1zm-1 1h1v1h-1v-1zM37 34v1h-1v-1h1zm1 1v1h-1v-1h1zM34 36h1v1h-1v-1zm0-1h1v1h-1v-1zm1 0h1v1h-1v-1z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
      }}
    >
      {/* ── 1. Hero / Hook ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto pt-12 md:pt-20 mb-32">
        <div className="relative mb-16 md:mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-[14vw] md:text-[10vw] font-medium text-black leading-none tracking-tighter"
          >
            About
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 0.1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="absolute top-[60%] left-[5%] md:left-[8%] whitespace-nowrap"
          >
            <span className="text-[12vw] md:text-[8vw] font-medium text-black leading-none tracking-tighter">
              Ryan Kroge
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="max-w-3xl"
        >
          <h2 className="text-[28px] md:text-[42px] font-medium text-black leading-tight tracking-tight">
            I get small businesses funded. <br className="hidden md:block" />
            That&apos;s it. That&apos;s the job.
          </h2>
        </motion.div>
      </section>

      {/* ── 2. The Inside Perspective ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto mb-32 md:mb-48 border-t border-black/10 pt-24 md:pt-32">
        <div className="flex flex-col md:flex-row justify-end gap-12 md:gap-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="md:max-w-xl"
          >
            <div className="space-y-8 text-[17px] md:text-[19px] text-black/70 leading-relaxed font-normal">
              <p>
                Most bankers hand you a pamphlet and wish you luck.
              </p>
              <p>
                I&apos;ve spent <strong className="text-black font-semibold">25 years on the inside</strong> — I know exactly how lenders think, what they hate, and what makes them say yes without hesitation.
              </p>
              <p className="text-black font-medium text-[20px] md:text-[22px]">
                I use that knowledge to get you funded.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 3. Who I Am ──────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto mb-48">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <span className="font-kiona text-[10px] text-black/40 block mb-8 tracking-[0.2em]">IDENTITY</span>
            <h2 className="text-[2.5rem] md:text-[3.5rem] font-medium text-black leading-[1.1] tracking-tighter">
              Who I Am
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8 text-[15px] md:text-[16px] text-black/60 leading-relaxed"
          >
            <p>
              I&apos;m Ryan Kroge. Small business lending specialist. Detroit-based, nationwide reach.
            </p>
            <p>
              I don&apos;t push loans. I build deals — creative, well-structured deals that unlock money most business owners didn&apos;t think they could access.
            </p>
            <p>
              I work with founders, operators, and buyers at every stage. Whether you&apos;re acquiring a business, expanding, or just tired of operating on fumes — I&apos;ve seen your situation before, and I know the path forward.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 4. Why Owners Choose Me ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto py-32 md:py-48 border-y border-black/10">
        <h2 className="text-[32px] md:text-[48px] font-medium text-black mb-20 tracking-tight leading-none text-center">
          Why Owners Choose Me Over Every Other Banker
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
          {[
            {
              title: "I answer in 24 hours.",
              description: "Yes or no. No \"we'll circle back.\" No radio silence for two weeks. You deserve to know where you stand — fast."
            },
            {
              title: "I've been doing this for 25+ years.",
              description: "That's not a resume flex. That's pattern recognition. I've seen what works, what doesn't, and how to structure your deal so the lender can't say no."
            },
            {
              title: "I think like a lender, work like an advisor.",
              description: "I'm on your side — but I know the other side of the table better than anyone. That perspective is worth more than any generic lending checklist."
            },
            {
              title: "I'm backed by an elite team.",
              description: "SBA financing is complex. My team has seen every edge case, exception, and creative structure in the book. You're not getting one person's opinion — you're getting decades of collective expertise."
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              viewport={{ once: true }}
              className="flex flex-col gap-6"
            >
              <h3 className="text-[20px] md:text-[24px] font-medium text-black leading-tight border-l-2 border-[#D4AF37] pl-6">
                {item.title}
              </h3>
              <p className="text-[15px] md:text-[16px] text-black/60 leading-relaxed pl-6">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 5. The 4-Step Path ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto py-32 md:py-48 border-b border-black/10">
        <div className="mb-24">
          <span className="font-kiona text-[10px] text-black/40 block mb-6 tracking-[0.2em]">PROCESS</span>
          <h2 className="text-[32px] md:text-[56px] font-medium text-black leading-none tracking-tight">
            The 4-Step Path to Funded
          </h2>
          <p className="mt-8 text-black/50 text-[16px] md:text-[18px]">No mystery. No bureaucratic black hole. Here&apos;s exactly what happens:</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            {
              step: "Step 1",
              title: "The Discovery Call (30 min)",
              content: "We talk about your business, your goals, and which loan type actually fits your situation. No fluff. Just a real conversation."
            },
            {
              step: "Step 2",
              title: "Tax Return Review",
              content: "We pull your business and personal returns and figure out if you qualify. Honest assessment, no sugarcoating."
            },
            {
              step: "Step 3",
              title: "Personal Financial Form",
              content: "We review your personal financial picture to confirm eligibility. If something&apos;s off, we tell you — and we tell you how to fix it."
            },
            {
              step: "Step 4",
              title: "Financial Statement Review",
              content: "We verify the business can handle repayment. If you&apos;re ready, we move. If not, we map out what needs to happen."
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              viewport={{ once: true }}
              className="flex flex-col"
            >
              <span className="text-[12px] font-medium text-[#D4AF37] mb-4 uppercase tracking-widest">{item.step}</span>
              <h4 className="text-[18px] md:text-[20px] font-medium text-black mb-6 leading-tight h-auto md:h-14">{item.title}</h4>
              <p className="text-[14px] md:text-[15px] text-black/50 leading-relaxed font-normal">{item.content}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 text-[18px] text-black font-medium text-center"
        >
          Four steps. Clear answers. No wasted time on either side.
        </motion.p>
      </section>

      {/* ── 6. The Mission ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto py-32 md:py-48 text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <span className="font-kiona text-[10px] text-black/40 block mb-10 tracking-[0.2em]">THE MISSION</span>
          <h2 className="text-[2.5rem] md:text-[5rem] font-medium text-black leading-[1.05] tracking-tighter italic">
            &ldquo;Get your business funded. <br className="hidden md:block" />
            Help it grow. Repeat.&rdquo;
          </h2>
          <p className="mt-12 text-black/60 text-[16px] md:text-[18px] max-w-2xl mx-auto leading-relaxed">
            Capital is the difference between a business that survives and one that scales. I&apos;ve made it my life&apos;s work to make sure more small businesses get that shot.
          </p>
        </motion.div>
      </section>

      {/* ── 7. A Bit More About Me ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto mb-48 bg-black/[0.02] p-12 md:p-24 border border-black/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
          >
            <h2 className="text-[32px] md:text-[40px] font-medium text-black leading-tight mb-8">
              A Bit More <br className="hidden md:block" />About Me
            </h2>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8 text-[15px] md:text-[16px] text-black/60 leading-relaxed font-normal"
          >
            <p>
              I&apos;m a family man. I know what it costs to waste someone&apos;s time — and I won&apos;t do it.
            </p>
            <p>
              That&apos;s why everything I do is built around speed, honesty, and results. I don&apos;t do vague timelines. I don&apos;t do fluff. I give you a real answer, a real plan, and real support from a team that actually knows what they&apos;re doing.
            </p>
            <p className="text-black font-medium">
              You&apos;re not a file number here. <br />
              You&apos;re a business owner with a real goal — and that matters.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 8. Final CTA ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto mb-48 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-[2.5rem] md:text-[3.5rem] font-medium text-black leading-tight tracking-tight mb-12">
            Let&apos;s Find Out If You Qualify
          </h2>
          
          <div className="flex flex-col items-center gap-10">
            <a 
              href="https://ryankroge.com/contact/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group w-full sm:w-auto font-kiona text-[12px] bg-black text-white px-12 py-6 hover:bg-[#D4AF37] transition-all duration-300 flex items-center justify-center gap-4 tracking-widest"
            >
              GET YOUR FREE BUSINESS VALUATION <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>

            <div className="flex flex-col sm:flex-row items-center gap-8 md:gap-16 pt-8 border-t border-black/10 w-full justify-center">
              <div className="flex items-center gap-4 text-black">
                <Phone size={20} className="text-[#D4AF37]" />
                <span className="text-[18px] font-medium">248-302-4032</span>
              </div>
              <div className="flex items-center gap-4 text-black/60">
                <Clock size={20} className="text-[#D4AF37]/60" />
                <span className="text-[14px]">Mon&ndash;Fri &middot; 9:00 AM &ndash; 5:00 PM EST</span>
              </div>
            </div>
          </div>
          
          <p className="mt-24 font-kiona text-[10px] text-black/30 tracking-[0.2em] italic">
            Ryan Kroge &middot; Small Business Lending Specialist &middot; Detroit, MI &middot; Serving Clients Nationwide
          </p>
        </motion.div>
      </section>
    </div>
  );
}
