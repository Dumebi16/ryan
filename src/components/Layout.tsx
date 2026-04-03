import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const Layout = () => {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-black text-[#e8e8e3] selection:bg-[#D4AF37] selection:text-black overflow-x-clip relative">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />

      {/* Side Label - Kiona Style */}
      <div className="fixed right-8 bottom-24 hidden lg:block pointer-events-none">
        <span className="font-kiona text-[9px] text-white/20 vertical-text">
          EST. 2026 — FUNDING THE FUTURE
        </span>
      </div>
    </div>
  );
};
