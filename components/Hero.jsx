'use client';
import { useState, useEffect } from 'react';
import { Download, Eye, Mail, ChevronDown, Phone } from 'lucide-react';
import { useAnimatedCounter } from '@/lib/hooks';
import { SITE } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { TRANSLATIONS } from '@/lib/translations';

/* ── SVG Social Icons ── */
const GithubIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedinIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

/* ── Floating tech icons ── */
const TECH_ICONS = [
  { label: 'C#',      color: '#a855f7', delay: '0s',    pos: 'top-6 -right-2 sm:right-2' },
  { label: 'Java',    color: '#f59e0b', delay: '0.8s',  pos: 'top-24 -right-4 sm:right-0' },
  { label: 'Cisco',   color: '#3b82f6', delay: '1.4s',  pos: 'top-44 -right-2 sm:right-4' },
  { label: 'AI',      color: '#00e5ff', delay: '0.4s',  pos: 'bottom-24 -right-4 sm:right-0' },
  { label: 'Net',     color: '#10b981', delay: '1.8s',  pos: 'bottom-6 -right-2 sm:right-6' },
];

/* ── Animated stat counter ── */
function StatCounter({ value, label, suffix = '', color }) {
  const [count, ref] = useAnimatedCounter(value);
  return (
    <div ref={ref} className="text-center">
      <div className="text-xl sm:text-2xl font-black font-mono" style={{ color }}>
        {count}{suffix}
      </div>
      <div className="text-[10px] sm:text-xs text-[var(--text-muted)] mt-0.5 font-medium">{label}</div>
    </div>
  );
}

const STATS = [
  { value: 5,    suffix: '+',  labelKey: 'statProjects',       color: 'var(--accent-cyan)' },
  { value: 4,    suffix: '',   labelKey: 'statCertificates',   color: 'var(--accent-blue)' },
  { value: 1500, suffix: '+',  labelKey: 'statHours',          color: 'var(--accent-purple)' },
  { value: 3,    suffix: '',   labelKey: 'statSpecializations',color: 'var(--accent-green)' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function Hero({ onOpenResume }) {
  const { lang } = useLanguage();
  const t = TRANSLATIONS[lang];
  const [typedText, setTypedText] = useState('');

  const wordsMap = {
    en: [
      'Computer Science Student',
      'Networking Specialist (Cisco)',
      'Software Developer (C# / Java)',
      'AI & ML Enthusiast',
    ],
    ar: [
      'طالب علوم حاسب',
      'متخصص في شبكات سيسكو',
      'مطور برمجيات (C# / Java)',
      'شغوف بالذكاء الاصطناعي',
    ]
  };

  /* ── Typing animation ── */
  useEffect(() => {
    const words = wordsMap[lang] || wordsMap.en;
    let wordIdx = 0, charIdx = 0, isDeleting = false, timer;
    const type = () => {
      const current = words[wordIdx];
      setTypedText(
        isDeleting
          ? current.substring(0, charIdx - 1)
          : current.substring(0, charIdx + 1)
      );
      isDeleting ? charIdx-- : charIdx++;

      let delay = isDeleting ? 35 : 75;
      if (!isDeleting && charIdx === current.length + 1) { isDeleting = true; delay = 1800; }
      else if (isDeleting && charIdx === 0)              { isDeleting = false; wordIdx = (wordIdx + 1) % words.length; delay = 320; }

      timer = setTimeout(type, delay);
    };

    timer = setTimeout(type, 600);
    return () => clearTimeout(timer);
  }, [lang]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-28 pb-16 z-10 overflow-hidden"
      aria-label="Hero section"
    >
      {/* ── Aurora orbs ── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="aurora-1" />
        <div className="aurora-2" />
        <div className="aurora-3" />
      </div>

      <div className="max-w-6xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* ── Left: Text ── */}
        <motion.div 
          className="lg:col-span-7 space-y-5 text-center lg:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Status badge */}
          <motion.div variants={itemVariants} className="inline-flex">
            <span className="status-open shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <span className="status-dot" />
              {t.heroStatus}
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1 variants={itemVariants} className="text-3xl sm:text-5xl xl:text-6xl font-black tracking-tight leading-[1.15]">
            {t.heroGreeting} <span className="gradient-text">{t.heroName}</span>
          </motion.h1>

          {/* Typing */}
          <motion.div variants={itemVariants} className="text-base sm:text-xl font-semibold text-[var(--accent-cyan)] min-h-[32px] flex items-center justify-center lg:justify-start gap-0.5">
            <span aria-live="polite" aria-label={typedText}>{typedText}</span>
            <span className="typed-cursor" aria-hidden="true" />
          </motion.div>

          {/* Bio */}
          <motion.p variants={itemVariants} className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
            {t.heroBio}
          </motion.p>

          {/* CTA buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
            <motion.a
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              href="/assets/cv/cv_ammar_mohamed.pdf"
              download
              className="btn-primary px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm flex items-center gap-2"
              aria-label={t.btnDownloadCV}
            >
              <Download className="w-4 h-4" /> {t.btnDownloadCV}
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenResume}
              className="btn-secondary px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm flex items-center gap-2"
              aria-label={t.btnPreviewResume}
            >
              <Eye className="w-4 h-4" /> {t.btnPreviewResume}
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              href="#contact"
              className="btn-secondary px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm flex items-center gap-2"
            >
              <Mail className="w-4 h-4" /> {t.btnContactMe}
            </motion.a>
          </motion.div>

          {/* Social links */}
          <motion.div variants={itemVariants} className="flex items-center justify-center lg:justify-start gap-2.5 pt-1">
            <motion.a whileHover={{ scale: 1.1, y: -2 }} href={SITE.github} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full glass-sm text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] transition-all" title={t.github}>
              <GithubIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.a>
            <motion.a whileHover={{ scale: 1.1, y: -2 }} href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full glass-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)] transition-all" title={t.linkedin}>
              <LinkedinIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.a>
            <motion.a whileHover={{ scale: 1.1, y: -2 }} href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full glass-sm text-[var(--text-secondary)] hover:text-emerald-400 transition-all" title={t.whatsapp}>
              <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.a>
            <motion.a whileHover={{ scale: 1.1, y: -2 }} href={`mailto:${SITE.email}`} className="p-2.5 rounded-full glass-sm text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] transition-all" title={t.email}>
              <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.a>
          </motion.div>

          {/* Animated stats */}
          <motion.div variants={itemVariants} className="glass-card grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 sm:p-5 rounded-2xl mt-4 max-w-xl mx-auto lg:mx-0">
            {STATS.map((s) => (
              <StatCounter key={s.labelKey} value={s.value} suffix={s.suffix} color={s.color} label={t[s.labelKey]} />
            ))}
          </motion.div>
        </motion.div>

        {/* ── Right: Avatar ── */}
        <motion.div 
          className="lg:col-span-5 flex justify-center relative my-4 lg:my-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.3, delay: 0.15 }}
        >
          {/* Floating tech icons */}
          {TECH_ICONS.map((icon) => (
            <motion.div
              key={icon.label}
              className={`absolute ${icon.pos} z-20 px-2.5 py-1 rounded-xl glass-sm text-[10px] font-bold shadow-lg`}
              style={{ color: icon.color, border: `1px solid ${icon.color}40`, backdropFilter: 'blur(12px)' }}
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: parseFloat(icon.delay) }}
              aria-hidden="true"
            >
              {icon.label}
            </motion.div>
          ))}

          {/* Glow background */}
          <div aria-hidden="true" className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full opacity-20 blur-3xl animate-glow-pulse" style={{ background: 'var(--gradient-primary)' }} />

          {/* Avatar container */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="relative w-64 h-80 sm:w-72 sm:h-96 xl:w-80 xl:h-[420px] rounded-3xl overflow-hidden border-2 shadow-[var(--glow-strong)] transition-all duration-300"
            style={{ borderColor: 'var(--border-glass-hover)' }}
          >
            <img src="/assets/images/avatar.png" alt="Portrait of Ammar Mohamed" className="w-full h-full object-cover object-top" loading="eager" />
          </motion.div>
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.a
        href="#about"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors animate-float-y"
        aria-label="Scroll to about section"
      >
        <span className="text-[10px] font-semibold tracking-widest uppercase">{lang === 'ar' ? 'مرر للأسفل' : 'Scroll'}</span>
        <ChevronDown className="w-4 h-4" />
      </motion.a>
    </section>
  );
}

