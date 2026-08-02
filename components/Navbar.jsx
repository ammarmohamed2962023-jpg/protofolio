'use client';
import { useState, useEffect } from 'react';
import { Sun, Moon, Terminal, Menu, X, Globe, FileText } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/utils';
import { useScrollSpy } from '@/lib/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { TRANSLATIONS } from '@/lib/translations';

const sectionIds = NAV_ITEMS.map(i => i.href.replace('#', ''));

const getTranslationKey = (label) => {
  const mapping = {
    'Home': 'navHome',
    'About': 'navAbout',
    'Skills': 'navSkills',
    'Services': 'navServices',
    'Projects': 'navProjects',
    'Certificates': 'navCertificates',
    'Blog': 'navBlog',
    'Contact': 'navContact'
  };
  return mapping[label] || label;
};

export default function Navbar({ onOpenTerminal }) {
  const [theme, setTheme]           = useState('dark');
  const { lang, changeLanguage }    = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);

  const activeId = useScrollSpy(sectionIds);

  /* ── Init from localStorage ── */
  useEffect(() => {
    const t = localStorage.getItem('ammar_theme') || 'dark';
    setTheme(t);
    document.documentElement.setAttribute('data-theme', t);
  }, []);

  /* ── Scroll detection ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Close mobile menu on resize ── */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ── Theme toggle ── */
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ammar_theme', next);
  };

  /* ── Language toggle ── */
  const toggleLang = () => {
    changeLanguage(lang === 'en' ? 'ar' : 'en');
  };

  const isActive = (href) => '#' + activeId === href;

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-4 left-1/2 w-[calc(100%-2rem)] max-w-6xl z-50
        rounded-[2rem] border backdrop-blur-xl transition-colors duration-300
        ${scrolled
          ? 'bg-[var(--bg-card)] border-[var(--border-glass-hover)] shadow-[var(--glow-cyan)]'
          : 'bg-[var(--bg-card)] border-[var(--border-glass)]'
        }`}
      style={{ translateX: "-50%" }}
    >
      <div className="px-5 py-2.5 flex items-center justify-between">

        {/* ── Logo ── */}
        <a href="#hero" className="flex items-center gap-2.5 no-underline group" aria-label="Go to top">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 rounded-full flex items-center justify-center font-black text-white text-sm shadow-[var(--glow-cyan)]"
            style={{ background: 'var(--gradient-primary)' }}
          >
            AM
          </motion.div>
          <span className="text-sm font-bold text-[var(--text-primary)] hidden sm:block">
            {TRANSLATIONS[lang].brandName}
          </span>
        </a>

        {/* ── Desktop Nav ── */}
        <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200
                ${isActive(item.href)
                  ? 'text-[var(--accent-cyan)] font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass-hover)]'
                }`}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {isActive(item.href) && (
                <motion.span
                  layoutId="navIndicator"
                  className="absolute inset-0 bg-[rgba(0,229,255,0.12)] border border-[rgba(0,229,255,0.25)] rounded-full shadow-[0_0_12px_rgba(0,229,255,0.15)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{TRANSLATIONS[lang][getTranslationKey(item.label)]}</span>
            </a>
          ))}
        </nav>

        {/* ── Actions ── */}
        <div className="flex items-center gap-2">

          {/* Resume CTA */}
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/assets/cv/cv_ammar_mohamed.pdf"
            download
            className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold
              btn-primary transition-all"
            aria-label={TRANSLATIONS[lang].resumeButton}
          >
            <FileText className="w-3.5 h-3.5" />
            {TRANSLATIONS[lang].resumeButton}
          </motion.a>

          {/* Theme */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full glass-sm flex items-center justify-center
              text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] transition-colors"
            aria-label="Toggle theme"
            title={theme === 'dark' ? TRANSLATIONS[lang].themeLight : TRANSLATIONS[lang].themeDark}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* Language */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleLang}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full glass-sm
              text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] text-[10px] font-bold transition-colors"
            aria-label="Toggle language"
            title={TRANSLATIONS[lang].switchLang}
          >
            <Globe className="w-3 h-3" />
            {lang === 'en' ? 'AR' : 'EN'}
          </motion.button>

          {/* Terminal */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onOpenTerminal}
            className="w-8 h-8 rounded-full glass-sm flex items-center justify-center
              text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] transition-colors"
            aria-label="Open terminal"
            title={TRANSLATIONS[lang].openTerminal}
          >
            <Terminal className="w-3.5 h-3.5" />
          </motion.button>

          {/* Mobile hamburger */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-8 h-8 rounded-full glass-sm flex items-center justify-center
              text-[var(--text-primary)] transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={mobileOpen ? 'open' : 'closed'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t border-[var(--border-glass)] overflow-hidden bg-[var(--bg-secondary)] rounded-b-[2rem]"
            role="menu"
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  role="menuitem"
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors overflow-hidden
                    ${isActive(item.href)
                      ? 'text-[var(--accent-cyan)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass-hover)]'
                    }`}
                >
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="mobileNavIndicator"
                      className="absolute inset-0 bg-[rgba(0,229,255,0.08)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{TRANSLATIONS[lang][getTranslationKey(item.label)]}</span>
                </a>
              ))}
              <a
                href="/assets/cv/cv_ammar_mohamed.pdf"
                download
                className="mt-2 btn-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 justify-center"
              >
                <FileText className="w-4 h-4" /> {TRANSLATIONS[lang].resumeButton}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
