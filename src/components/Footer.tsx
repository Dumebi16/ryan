import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/[0.08] px-6 sm:px-10 lg:px-24 pt-16 md:pt-20 pb-8">
      {/* ── Main grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-14 border-b border-white/[0.06]">
        {/* Brand block */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Link to="/" className="font-kiona text-[13px] text-white tracking-[0.28em] block mb-4">
            RYAN KROGE
          </Link>
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
              (link) => {
                const path = link === 'Home' ? '/' : link === 'About' ? '/about' : '#';
                return path === '#' ? (
                  <a
                    key={link}
                    href="#"
                    className="text-[13px] text-white/45 hover:text-white/85 transition-colors duration-200 leading-none"
                  >
                    {link}
                  </a>
                ) : (
                  <Link
                    key={link}
                    to={path}
                    className="text-[13px] text-white/45 hover:text-white/85 transition-colors duration-200 leading-none"
                  >
                    {link}
                  </Link>
                );
              }
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
            TERMS OF SERVICE
          </a>
        </div>
      </div>
    </footer>
  );
};
