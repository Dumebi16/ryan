import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navState, setNavState] = useState<'top' | 'hidden' | 'floating'>('top');
  const lastScrollYRef = useRef(0);
  const lastNavStateRef = useRef<'top' | 'hidden' | 'floating'>('top');
  const location = useLocation();

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

  // Close menu on location change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'SBA Loans', path: '#sba-loans' },
    { name: 'Blog', path: '#blog' },
  ];

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
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
          className="flex items-center justify-between px-6 py-5 md:px-10 md:py-4 pointer-events-auto"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="font-kiona text-base md:text-lg text-white tracking-[0.3em]">RYAN KROGE</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((item) => (
              item.path.startsWith('#') ? (
                <a key={item.name} href={item.path} className="font-kiona text-[10px] text-white/90 hover:text-primary transition-colors">
                  {item.name}
                </a>
              ) : (
                <Link key={item.name} to={item.path} className="font-kiona text-[10px] text-white/90 hover:text-primary transition-colors">
                  {item.name}
                </Link>
              )
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

      {/* Mobile Menu Overlay */}
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
                {navLinks.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    {item.path.startsWith('#') ? (
                      <a
                        href={item.path}
                        className="font-kiona text-lg text-white/80 hover:text-primary transition-colors tracking-[0.4em]"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        to={item.path}
                        className="font-kiona text-lg text-white/80 hover:text-primary transition-colors tracking-[0.4em]"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </motion.div>
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
    </>
  );
};
