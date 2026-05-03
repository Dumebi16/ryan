import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  heading?: string;
  body?: string;
}

export default function CTASection({
  heading = "Ready to Move Forward?",
  body = "Whether you're selling, buying, or just figuring out if this is even the right time — let's talk. No pressure, no pitch. Just a real conversation.",
}: Props) {
  return (
    <div className="border-t border-white/10 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-5xl font-light mb-6 tracking-tight">{heading}</h2>
            <p className="text-white/60 text-lg leading-relaxed">{body}</p>
          </div>
          <div className="flex flex-col items-start md:items-center gap-5 md:gap-8">
            <Link
              to="/contact"
              className="group w-full md:w-auto inline-flex items-center justify-center gap-3 bg-[#D4AF37] text-black px-10 py-4 text-[11px] font-bold font-kiona tracking-widest uppercase transition-colors duration-300 hover:bg-white hover:text-black"
            >
              Get in Touch
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
            </Link>
            <p className="text-white/30 text-xs tracking-wide text-center">
              No commitment required. Typical response within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
