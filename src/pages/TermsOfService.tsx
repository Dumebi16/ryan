import { motion } from "motion/react";
import { SEO } from "../components/SEO";

export default function TermsOfService() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white/90 selection:bg-[#D4AF37] selection:text-black font-light relative overflow-hidden">
      {/* Premium Background Glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 65% 55% at 50% 30%, rgba(212,175,55,0.06) 0%, transparent 70%)",
        }}
      />

      <SEO
        title="Terms of Service — Ryan Kroge"
        description="Read the terms and conditions governing your use of ryankroge.com and our advisory consulting services."
        path="/terms-of-service"
        type="website"
      />

      {/* Hero Header */}
      <div className="relative pt-32 md:pt-48 pb-12 px-6 z-10">
        <div className="max-w-4xl mx-auto text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
              <div className="w-12 h-[1px] bg-[#D4AF37]" />
              <span className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase font-kiona font-bold">Legal</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-light mb-4 tracking-tight">
              Terms of Service
            </h1>
            <p className="text-white/40 text-xs tracking-widest font-kiona mb-8">
              LAST UPDATED: JULY 2026
            </p>
            <div className="w-full h-[1px] bg-white/10" />
          </motion.div>
        </div>
      </div>

      {/* Document Body */}
      <div className="relative max-w-4xl mx-auto px-6 pb-24 z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="article-content"
        >
          <p>
            These Terms of Service ("Terms") govern your use of the website ryankroge.com (the "Website") and any consultation or advisory services provided by Ryan Kroge ("we," "us," or "our"). By accessing the Website or scheduling a call, you agree to be bound by these Terms.
          </p>

          <h2>1. Services Offered & Disclaimers</h2>
          <p>
            The Website provides information regarding SBA loans, business acquisition financing, and strategic financial guidance.
          </p>
          <ul>
            <li>
              <strong>No Financial Guarantee:</strong> Any guidance, estimates, templates, or advice provided is for informational purposes only. Ryan Kroge is an independent specialist and advisor, not a lender. Funding approval is subject to the independent underwriting, terms, and conditions of participating banks and the U.S. Small Business Administration.
            </li>
            <li>
              <strong>No Professional Liability:</strong> Consultations and Website materials do not constitute legal, tax, or official banking advice. You should consult a licensed accountant, attorney, or financial advisor before executing business agreements.
            </li>
          </ul>

          <h2>2. Website Updates & Removal of Pages</h2>
          <p>
            We reserve the right to modify, suspend, or discontinue any aspect of the Website or our services at any time without notice or liability. In line with this, we have simplified our online structure and removed outdated services pages. We are not liable to you or any third party for any changes, modifications, or deprecations of pages or services.
          </p>

          <h2>3. Integrated Third-Party Services</h2>
          <p>
            Our scheduling system and interactive phone booking system rely on third-party integrations, including Cal.com, Retell AI, Twilio, and Supabase. By booking an appointment or contacting us, you agree to comply with the terms and policies of these respective platforms.
          </p>

          <h2>4. User Conduct & Submissions</h2>
          <p>
            You agree to use the Website only for lawful purposes. When submitting contact forms or booking calls:
          </p>
          <ul>
            <li>You must provide accurate, complete, and current information.</li>
            <li>You must not submit harmful or malicious code, spam, or abusive communications.</li>
            <li>
              You agree that call recordings and speech-to-text transcripts generated during scheduling phone calls may be recorded for quality and scheduling purposes.
            </li>
          </ul>

          <h2>5. Intellectual Property</h2>
          <p>
            All content, design elements, text, graphics, logos, and layouts on this Website are the intellectual property of Ryan Kroge or our licensors, protected by copyright and trademark laws. You may not copy, reproduce, or distribute any materials without express written consent.
          </p>

          <h2>6. Governing Law & Jurisdiction</h2>
          <p>
            These Terms and any disputes arising out of or related to your use of this Website shall be governed by, construed, and enforced in accordance with the laws of the <strong>State of Michigan, United States</strong>, without regard to conflict of law principles. Any legal action must be brought in the state or federal courts located in or serving Detroit, Michigan.
          </p>

          <h2>7. Contact Information</h2>
          <p>
            For inquiries regarding these Terms of Service, please contact us at:
          </p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:hello@ryankroge.com">hello@ryankroge.com</a></li>
            <li><strong>Location:</strong> Detroit, Michigan</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
