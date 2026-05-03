import { motion, AnimatePresence } from "motion/react";
import { useState, ChangeEvent } from "react";
import { supabase } from "../lib/supabase";
import {
  Phone,
  Mail,
  MessageSquare,
  CheckCircle,
  Clock,
  Users,
  Globe,
  BookOpen,
  Lock,
  ArrowRight,
  ChevronDown,
  Calendar,
} from "lucide-react";

// ─── Hero ──────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative w-full flex flex-col items-center justify-center pt-32 sm:pt-40 md:pt-48 min-h-[70vh] px-6 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(212,175,55,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-kiona text-[9px] sm:text-[10px] text-white tracking-[0.3em] mb-8 block uppercase"
        >
          GET IN TOUCH
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] font-medium text-white leading-[1.0] tracking-tight mb-6"
        >
          Have a Question?<br />
          <span className="text-white/40">Let's Talk.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="text-white/55 text-lg sm:text-xl max-w-2xl leading-relaxed mb-10"
        >
          Whether you're just starting to explore your options or you're ready
          to take the next step — Ryan is here to help. No confusing language.
          No pressure. Just a real conversation about what's possible for you
          and your business.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <a
            href="#contact-form"
            className="group inline-flex items-center gap-3 bg-[#D4AF37] text-black px-10 py-4 text-[11px] font-bold font-kiona tracking-widest uppercase transition-all duration-300 hover:bg-white hover:text-black"
          >
            Send Ryan a Message
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <p className="font-kiona text-[8px] text-white/30 tracking-[0.2em] uppercase">
            Typical response time: within 24 hours on business days.
          </p>
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
}

// ─── Three Ways to Reach Ryan ──────────────────────────────────────────────────
function ContactOptionsSection() {
  return (
    <section className="relative w-full border-t border-white/[0.04] py-20 sm:py-28 px-6 sm:px-10 lg:px-24">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-medium text-white leading-[1.05] tracking-tight"
          >
            Choose the Way That Works Best for You
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Phone */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="bg-[#0a0a0a]/60 backdrop-blur-lg border border-white/[0.08] p-8 sm:p-10 flex flex-col gap-5 relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            <Phone className="w-6 h-6 text-[#D4AF37]" strokeWidth={1.5} />
            <div>
              <h3 className="text-white text-lg font-medium mb-2 tracking-tight">
                Prefer to Talk on the Phone?
              </h3>
              <a
                href="tel:+19472181845"
                className="text-[#D4AF37] text-2xl font-medium tracking-tight hover:opacity-80 transition-opacity block mb-3"
              >
                (947) 218-1845
              </a>
              <p className="text-white/45 text-sm leading-relaxed">
                Available Monday – Friday, 9am – 5pm ET. Ryan's AI assistant
                answers immediately and can book your consultation on the spot.
              </p>
            </div>
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            viewport={{ once: true, amount: 0.2 }}
            className="bg-[#0a0a0a]/60 backdrop-blur-lg border border-white/[0.08] p-8 sm:p-10 flex flex-col gap-5 relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            <Mail className="w-6 h-6 text-[#D4AF37]" strokeWidth={1.5} />
            <div>
              <h3 className="text-white text-lg font-medium mb-2 tracking-tight">
                More of an Email Person?
              </h3>
              <a
                href="mailto:hello@ryankroge.com"
                className="text-[#D4AF37] text-base font-medium tracking-tight hover:opacity-80 transition-opacity block mb-3 break-all"
              >
                hello@ryankroge.com
              </a>
              <p className="text-white/45 text-sm leading-relaxed">
                Ryan personally reads every email and responds within 24 hours
                on business days.
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            viewport={{ once: true, amount: 0.2 }}
            className="bg-[#0a0a0a]/60 backdrop-blur-lg border border-white/[0.08] p-8 sm:p-10 flex flex-col gap-5 relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            <MessageSquare className="w-6 h-6 text-[#D4AF37]" strokeWidth={1.5} />
            <div>
              <h3 className="text-white text-lg font-medium mb-2 tracking-tight">
                Want to Fill Out a Quick Form?
              </h3>
              <a
                href="#contact-form"
                className="text-[#D4AF37] text-base font-medium tracking-tight hover:opacity-80 transition-opacity block mb-3"
              >
                Use the form below →
              </a>
              <p className="text-white/45 text-sm leading-relaxed">
                It only takes two minutes. Just tell Ryan your name, how to
                reach you, and what's on your mind. He'll take it from there.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── What to Expect ────────────────────────────────────────────────────────────
const STEPS = [
  {
    num: "01",
    title: "You Reach Out",
    desc: "Send a message, call, or email. Tell Ryan a little about yourself and what's on your mind. There's no form to fill out perfectly — just say hello.",
  },
  {
    num: "02",
    title: "Ryan Gets Back to You",
    desc: "Within 24 hours (usually sooner), Ryan will personally respond. He'll listen first, answer your questions, and help you figure out the best next step — even if that step is \"let's wait a few months.\"",
  },
  {
    num: "03",
    title: "You Decide What's Next",
    desc: "There's no obligation, no sales pitch, and no pressure. If it makes sense to move forward together, great. If not, you'll still walk away with useful information.",
  },
];

function WhatToExpectSection() {
  return (
    <section className="relative w-full bg-black py-20 sm:py-28 px-6 sm:px-10 lg:px-24 border-t border-white/[0.04]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14 sm:mb-16">
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
            className="text-2xl sm:text-3xl md:text-4xl font-medium text-white leading-[1.05] tracking-tight"
          >
            Not Sure What to Say?<br className="hidden sm:block" />{" "}
            Here's What Happens Next.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-white/45 text-base sm:text-lg max-w-2xl mx-auto mt-4 leading-relaxed"
          >
            A lot of people hesitate to reach out because they're not sure if
            their question is "big enough" or if they're ready. There's no
            wrong time to start a conversation.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {STEPS.map(({ num, title, desc }, i) => (
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
              <span className="font-kiona text-[#D4AF37] text-[9px] tracking-widest">{num}</span>
              <div>
                <h3 className="text-white text-xl font-medium mb-3 tracking-tight leading-snug">
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

// ─── Phone CTA ─────────────────────────────────────────────────────────────────
function PhoneCTASection() {
  return (
    <section className="relative w-full bg-black py-20 sm:py-28 px-6 sm:px-10 lg:px-24 border-t border-white/[0.04]">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(212,175,55,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative overflow-hidden border border-[#D4AF37]/20 bg-[#0a0a0a]/60 backdrop-blur-lg p-10 sm:p-14 flex flex-col items-center text-center gap-8"
        >
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/[0.03] to-transparent pointer-events-none" />

          <div className="w-14 h-14 border border-[#D4AF37]/30 flex items-center justify-center relative z-10">
            <Phone className="w-6 h-6 text-[#D4AF37]" strokeWidth={1.5} />
          </div>

          <div className="relative z-10">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="font-kiona text-[9px] text-[#D4AF37] tracking-[0.3em] uppercase block mb-4"
            >
              SPEAK WITH RYAN'S AI ASSISTANT
            </motion.span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white leading-[1.05] tracking-tight mb-4">
              Call to Book Your Free Consultation
            </h2>

            <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-8">
              Call <strong className="text-white font-medium">(947) 218-1845</strong> and Ryan's AI assistant will answer immediately — available around the clock. It will qualify your needs, check Ryan's live calendar, and book your consultation on the spot.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="tel:+19472181845"
                className="group inline-flex items-center gap-3 bg-[#D4AF37] text-black px-10 py-4 text-[11px] font-bold font-kiona tracking-widest uppercase transition-all duration-300 hover:bg-white hover:text-black w-full sm:w-auto justify-center"
              >
                <Phone className="w-4 h-4" strokeWidth={2} />
                Call (947) 218-1845
              </a>
              <a
                href="https://cal.com/ryan-kroge-nsvqdg/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 border border-white/20 text-white px-10 py-4 text-[11px] font-bold font-kiona tracking-widest uppercase transition-all duration-300 hover:bg-white hover:text-black hover:border-white w-full sm:w-auto justify-center"
              >
                <Calendar className="w-4 h-4" strokeWidth={1.5} />
                Book Online Instead
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Contact Form helpers ──────────────────────────────────────────────────────
const RATE_LIMIT_KEY = "contact_submissions";
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function getStoredTimestamps(): number[] {
  try {
    return JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function checkRateLimit(): { blocked: boolean; waitMinutes: number } {
  const now = Date.now();
  const recent = getStoredTimestamps().filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    const oldest = Math.min(...recent);
    const waitMs = RATE_LIMIT_WINDOW_MS - (now - oldest);
    return { blocked: true, waitMinutes: Math.ceil(waitMs / 60_000) };
  }
  return { blocked: false, waitMinutes: 0 };
}

function recordSubmission() {
  const now = Date.now();
  const recent = getStoredTimestamps().filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify([...recent, now]));
}

// ─── Contact Form ──────────────────────────────────────────────────────────────
const INPUT_BASE =
  "w-full bg-black/60 border border-white/[0.12] text-white placeholder-white/20 px-5 py-4 text-base focus:outline-none focus:border-[#D4AF37]/50 transition-colors rounded-none";
const LABEL_BASE =
  "block font-kiona text-[8px] text-white/50 tracking-[0.2em] uppercase mb-2";

type FormState = "idle" | "submitting" | "success" | "error";

function ContactFormSection() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    type: "",
    message: "",
    newsletter: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!data.firstName.trim()) e.firstName = "Please enter your first name.";
    if (!data.lastName.trim()) e.lastName = "Please enter your last name.";
    if (!data.email.trim() || !/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(data.email))
      e.email = "Please enter a valid email address.";
    if (!data.type) e.type = "Please select an option.";
    if (!data.message.trim()) e.message = "Please tell Ryan what's on your mind.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const { blocked, waitMinutes } = checkRateLimit();
    if (blocked) {
      setErrors({ _rateLimit: `You've submitted too many times. Please wait ${waitMinutes} minute${waitMinutes !== 1 ? "s" : ""} before trying again.` });
      return;
    }

    setErrors({});
    setFormState("submitting");

    try {
      // 1. Save lead to Supabase (CRM)
      const { data: lead, error: dbError } = await supabase
        .from("leads")
        .insert({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone || null,
          inquiry_type: data.type,
          message: data.message,
          subscribe_newsletter: data.newsletter,
          source: "contact_form",
        })
        .select("id")
        .single();

      if (dbError) throw dbError;

      // 2. Trigger confirmation email + Ryan notification via Edge Function
      // This is non-blocking — form succeeds even if email fails
      supabase.functions.invoke("on-lead-created", {
        body: {
          id: lead.id,
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          inquiry_type: data.type,
          message: data.message,
          subscribe_newsletter: data.newsletter,
        },
      }).catch(console.error);

      recordSubmission();
      setFormState("success");
    } catch (err) {
      console.error("Form submission error:", err);
      setFormState("error");
    }
  };

  const set = (field: string) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setData((d) => ({ ...d, [field]: value }));
    setErrors((err) => { const n = { ...err }; delete n[field]; return n; });
  };

  return (
    <section
      id="contact-form"
      className="relative w-full bg-black py-20 sm:py-28 px-6 sm:px-10 lg:px-24 border-t border-white/[0.04]"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 sm:mb-14">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-kiona text-[9px] sm:text-[10px] text-[#D4AF37] tracking-[0.25em] font-medium mb-6 block uppercase"
          >
            CONTACT FORM
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-medium text-white leading-[1.05] tracking-tight mb-4"
          >
            Send Ryan a Message
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-white/45 text-base sm:text-lg leading-relaxed"
          >
            Fill out the form below and Ryan will get back to you within one
            business day.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="bg-[#0a0a0a]/60 backdrop-blur-lg border border-white/[0.08] p-8 sm:p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />

          <AnimatePresence mode="wait">
            {formState === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center text-center py-12 gap-6"
              >
                <div className="w-14 h-14 border border-[#D4AF37]/40 flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-[#D4AF37]" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-white text-2xl font-medium mb-3 tracking-tight">
                    Message Received.
                  </h3>
                  <p className="text-white/55 text-base leading-relaxed max-w-sm mx-auto">
                    Ryan received your message and will be in touch within one
                    business day. If you need to reach him sooner, call{" "}
                    <a href="tel:+19472181845" className="text-[#D4AF37] hover:opacity-80 transition-opacity">
                      (947) 218-1845
                    </a>.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="firstName" className={LABEL_BASE}>
                      First Name <span className="text-[#D4AF37]">*</span>
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      autoComplete="given-name"
                      placeholder="e.g. John"
                      value={data.firstName}
                      onChange={set("firstName")}
                      className={INPUT_BASE}
                    />
                    {errors.firstName && (
                      <p className="text-red-400 text-xs mt-2">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className={LABEL_BASE}>
                      Last Name <span className="text-[#D4AF37]">*</span>
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      autoComplete="family-name"
                      placeholder="e.g. Smith"
                      value={data.lastName}
                      onChange={set("lastName")}
                      className={INPUT_BASE}
                    />
                    {errors.lastName && (
                      <p className="text-red-400 text-xs mt-2">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className={LABEL_BASE}>
                    Email Address <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="e.g. john@email.com"
                    value={data.email}
                    onChange={set("email")}
                    className={INPUT_BASE}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-2">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className={LABEL_BASE}>
                    Phone Number{" "}
                    <span className="text-white/25 normal-case font-sans tracking-normal" style={{ fontSize: '10px' }}>
                      optional
                    </span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="e.g. (555) 000-0000"
                    value={data.phone}
                    onChange={set("phone")}
                    className={INPUT_BASE}
                  />
                </div>

                <div>
                  <label htmlFor="type" className={LABEL_BASE}>
                    What best describes you? <span className="text-[#D4AF37]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="type"
                      value={data.type}
                      onChange={set("type")}
                      className={`${INPUT_BASE} appearance-none pr-10 cursor-pointer`}
                      style={{ background: "rgba(0,0,0,0.6)" }}
                    >
                      <option value="" disabled>Select one...</option>
                      <option value="buy">I want to buy a business</option>
                      <option value="sell">I want to sell my business</option>
                      <option value="sba">I'm interested in an SBA loan</option>
                      <option value="guidance">I need financial guidance</option>
                      <option value="exploring">I'm just exploring my options</option>
                      <option value="other">Something else</option>
                    </select>
                    <ChevronDown
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none"
                      strokeWidth={1.5}
                    />
                  </div>
                  {errors.type && (
                    <p className="text-red-400 text-xs mt-2">{errors.type}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className={LABEL_BASE}>
                    Your Message <span className="text-[#D4AF37]">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Tell Ryan what's on your mind..."
                    value={data.message}
                    onChange={set("message")}
                    className={`${INPUT_BASE} resize-none`}
                  />
                  {errors.message && (
                    <p className="text-red-400 text-xs mt-2">{errors.message}</p>
                  )}
                </div>

                {/* ── CAPTCHA (recommended: Cloudflare Turnstile) ──────────────────
                    To add Turnstile:
                    1. npm install @marsidev/react-turnstile
                    2. Get a free Site Key at dash.cloudflare.com > Turnstile
                    3. Replace this comment block with:

                    import { Turnstile } from "@marsidev/react-turnstile";
                    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

                    <Turnstile
                      siteKey="YOUR_SITE_KEY"
                      onSuccess={setCaptchaToken}
                      className="mt-1"
                    />

                    Then pass captchaToken in the Supabase insert and verify it in
                    the on-lead-created Edge Function via Cloudflare's verify API.
                ─────────────────────────────────────────────────────────────────── */}

                {errors._rateLimit && (
                  <p className="text-amber-400 text-sm text-center bg-amber-400/5 border border-amber-400/20 px-4 py-3">
                    {errors._rateLimit}
                  </p>
                )}

                {/* Newsletter opt-in */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={data.newsletter}
                    onChange={set("newsletter")}
                    className="accent-[#D4AF37] w-4 h-4 mt-0.5 shrink-0 cursor-pointer"
                  />
                  <span className="text-white/50 text-sm leading-relaxed group-hover:text-white/70 transition-colors">
                    Subscribe to Ryan's newsletter — insights on SBA loans, business acquisition, and strategy. No spam, unsubscribe anytime.
                  </span>
                </label>

                <div className="flex flex-col gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={formState === "submitting"}
                    className="group w-full inline-flex items-center justify-center gap-3 bg-[#D4AF37] text-black px-10 py-4 text-[11px] font-bold font-kiona tracking-widest uppercase transition-all duration-300 hover:bg-white hover:text-black disabled:opacity-60 disabled:pointer-events-none"
                  >
                    {formState === "submitting" ? (
                      "Sending..."
                    ) : (
                      <>
                        Send My Message
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  {formState === "error" && (
                    <p className="text-red-400 text-sm text-center">
                      Something went wrong. Please try again or call{" "}
                      <a href="tel:+19472181845" className="underline">(947) 218-1845</a>.
                    </p>
                  )}

                  <div className="flex items-start gap-3">
                    <Lock className="w-3.5 h-3.5 text-white/25 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <p className="text-white/30 text-xs leading-relaxed">
                      Your information is kept private and will never be shared
                      or sold. Ryan uses it only to respond to your inquiry.
                    </p>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

// ─── FAQ ───────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "What exactly is an SBA loan?",
    a: "An SBA loan is a business loan that's backed by the U.S. government through the Small Business Administration. This backing means banks are more willing to lend — often at lower interest rates and with more flexible repayment terms than a regular business loan. Think of it as extra support that makes borrowing easier and more affordable.",
  },
  {
    q: "Do I need to have a business already to talk to Ryan?",
    a: "No. Ryan works with people at every stage — whether you already own a business, are thinking about buying one, or are just starting to ask questions. You don't need to have everything figured out to reach out.",
  },
  {
    q: "Is there a fee just to talk with Ryan?",
    a: "No. Your first conversation with Ryan is completely free. He'll listen to your situation and help you understand your options — with zero obligation to move forward.",
  },
  {
    q: "What if I don't understand financial or business terminology?",
    a: "That's completely okay — and honestly, very common. Ryan is known for explaining complex financial topics in plain, everyday language. If something is unclear, just ask. There are no silly questions here.",
  },
  {
    q: "How do I know if I qualify for an SBA loan?",
    a: "A few key things lenders typically look at: your credit score, how long you've been in business, your revenue, and whether you have collateral. Ryan can walk you through all of this in plain terms and help you figure out if you're ready — or what steps to take to get there.",
  },
  {
    q: "I'm thinking about selling my business someday, but not right now. Is it too early to talk?",
    a: "Not at all. In fact, the earlier you start planning, the better your outcome. Ryan can help you understand what your business might be worth today and what steps to take now so you're in the best position when the time comes.",
  },
  {
    q: "What if I've never bought or sold a business before?",
    a: "Most of Ryan's clients haven't. That's exactly why he's here — to guide you through every step so nothing feels overwhelming or confusing. You'll never be left wondering what's happening or what comes next.",
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative w-full bg-black py-20 sm:py-28 px-6 sm:px-10 lg:px-24 border-t border-white/[0.04]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 sm:mb-14">
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
            className="text-2xl sm:text-3xl md:text-4xl font-medium text-white leading-[1.05] tracking-tight mb-4"
          >
            Common Questions —<br className="hidden sm:block" /> Answered Simply
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-white/40 text-base leading-relaxed"
          >
            Not sure where to start? Here are answers to the questions Ryan
            hears most often. Plain and simple.
          </motion.p>
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
                  <span className="text-white text-base font-medium leading-snug tracking-tight group-hover:text-white/80 transition-colors">
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

// ─── Reassurance Strip ─────────────────────────────────────────────────────────
const TRUST_PILLARS = [
  {
    Icon: Clock,
    title: "25 Years of Experience",
    desc: "Ryan has spent over two decades in banking and business finance. He's seen almost every situation — and knows how to navigate them.",
  },
  {
    Icon: Users,
    title: "Personally Responsive",
    desc: "Ryan reads and responds to every message himself. You won't get handed off to a call center or an automated system.",
  },
  {
    Icon: Globe,
    title: "Nationwide Reach",
    desc: "Ryan works with business owners all across the United States — no matter where you're located.",
  },
  {
    Icon: BookOpen,
    title: "Plain English, Always",
    desc: "No confusing jargon. No fine print surprises. Ryan explains everything clearly so you always know where you stand.",
  },
];

function ReassuranceSection() {
  return (
    <section className="relative w-full bg-black py-20 sm:py-28 px-6 sm:px-10 lg:px-24 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-medium text-white leading-[1.05] tracking-tight"
          >
            You're in Good Hands.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {TRUST_PILLARS.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
              className="bg-[#0a0a0a]/60 backdrop-blur-lg border border-white/[0.08] p-7 sm:p-8 flex flex-col gap-4 relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
              <Icon className="w-6 h-6 text-[#D4AF37]" strokeWidth={1.5} />
              <div>
                <h3 className="text-white text-base font-medium mb-2 tracking-tight">{title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA Strip ───────────────────────────────────────────────────────────
function FinalCTASection() {
  return (
    <section className="relative w-full bg-black py-20 sm:py-28 px-6 sm:px-10 lg:px-24 border-t border-white/[0.04]">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-medium text-white leading-[1.05] tracking-tight mb-6"
        >
          Ready When You Are.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-white/50 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl mx-auto"
        >
          Whether you have a big question or just a small one — reaching out is
          always the right first step. Ryan is here to help you move forward
          with clarity and confidence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-5"
        >
          <a
            href="#contact-form"
            className="group inline-flex items-center gap-3 bg-[#D4AF37] text-black px-10 py-4 text-[11px] font-bold font-kiona tracking-widest uppercase transition-all duration-300 hover:bg-white hover:text-black"
          >
            Send Ryan a Message
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <p className="text-white/35 text-sm">
            Or call directly:{" "}
            <a
              href="tel:+19472181845"
              className="text-white/60 hover:text-white transition-colors font-medium"
            >
              (947) 218-1845
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Main Export ───────────────────────────────────────────────────────────────
export default function Contact() {
  return (
    <div className="relative bg-black min-h-screen">
      <HeroSection />
      <ContactOptionsSection />
      <WhatToExpectSection />
      <PhoneCTASection />
      <ContactFormSection />
      <FAQSection />
      <ReassuranceSection />
      <FinalCTASection />
    </div>
  );
}
