import { useState, useEffect } from 'react';
import { Building2, Menu, X, MapPin, Phone, Mail, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from 'next-themes';

const LOGO_PRIMARY = '#1a1a1a';
const LOGO_SECONDARY = '#525252';
const LOGO_TERTIARY = '#1c1917';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl shadow-lg shadow-slate-900/5 dark:shadow-slate-900/20 border-b border-slate-200/50 dark:border-slate-700/50'
        : 'bg-transparent'
    }`}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-24">
          <Link to="/" className="flex items-center gap-4 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" style={{background: `linear-gradient(to bottom right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY}, ${LOGO_TERTIARY})`}}></div>
              <div className="relative p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500" style={{background: `linear-gradient(to bottom right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY}, ${LOGO_TERTIARY})`}}>
                <Building2 className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                SylhetStay
              </h1>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Premium Living</p>
            </div>
          </Link>

           <div className="hidden lg:flex items-center gap-10">
            <Link to="/rooms" className="relative text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-300 group">
              Rooms
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-500 ease-out" style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY})`}}></span>
            </Link>
            <Link to="/facilities" className="relative text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-300 group">
              Facilities
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-500 ease-out" style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY})`}}></span>
            </Link>
            <Link to="/gallery" className="relative text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-300 group">
              Gallery
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-500 ease-out" style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY})`}}></span>
            </Link>
            <Link to="/about" className="relative text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-300 group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-500 ease-out" style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY})`}}></span>
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-2xl font-bold overflow-hidden group shadow-lg border-2 border-slate-200 dark:border-slate-700 transition-all duration-300"
            >
              <span className="relative z-10">Login / Sign Up</span>
            </Link>
            <Link
              to="/contact"
              className="relative px-8 py-3.5 text-white rounded-2xl font-bold overflow-hidden group shadow-lg transition-all duration-300"
              style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY}, ${LOGO_TERTIARY})`}}
            >
              <span className="relative z-10">Contact Us</span>
            </Link>
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-300"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="px-6 py-6 space-y-4">
            <Link to="/rooms" className="block py-3 text-slate-700 dark:text-slate-300 hover:text-sky-600 font-semibold transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Rooms
            </Link>
            <Link to="/facilities" className="block py-3 text-slate-700 dark:text-slate-300 hover:text-sky-600 font-semibold transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Facilities
            </Link>
            <Link to="/gallery" className="block py-3 text-slate-700 dark:text-slate-300 hover:text-sky-600 font-semibold transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Gallery
            </Link>
            <Link to="/about" className="block py-3 text-slate-700 dark:text-slate-300 hover:text-sky-600 font-semibold transition-colors" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <Link to="/contact" className="block py-3 text-slate-700 dark:text-slate-300 hover:text-sky-600 font-semibold transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </Link>
             <button
               onClick={() => {
                 setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
                 setMobileMenuOpen(false);
               }}
               className="flex items-center gap-3 py-3 text-slate-700 dark:text-slate-300 hover:text-sky-600 font-semibold transition-colors w-full"
             >
               {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
               {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
             </button>
            <Link to="/login" className="block py-3 px-6 mt-4 text-center bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-2xl font-bold border-2 border-slate-200 dark:border-slate-700 hover:border-sky-500 transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Login / Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
