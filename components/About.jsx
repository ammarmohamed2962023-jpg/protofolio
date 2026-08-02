'use client';
import { useState } from 'react';
import { Cpu, Zap, Users, GraduationCap, Target, BookOpen, Award, Code2 } from 'lucide-react';
import { useAnimatedCounter } from '@/lib/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { TRANSLATIONS } from '@/lib/translations';

/* ── Animated counter pill ── */
function Counter({ value, suffix = '', label, color }) {
  const [count, ref] = useAnimatedCounter(value, 1600);
  return (
    <div ref={ref} className="text-center p-4">
      <div className="text-3xl xl:text-4xl font-black font-mono" style={{ color }}>
        {count}{suffix}
      </div>
      <div className="text-xs text-[var(--text-muted)] mt-1 font-medium">{label}</div>
    </div>
  );
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

/* ── Trait card ── */
function TraitCard({ icon: Icon, title, description, color }) {
  return (
    <motion.div
      variants={itemVariants}
      className="glass-card text-left rtl:text-right space-y-3"
      whileHover={{ y: -5, borderColor: 'var(--border-glass-hover)' }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <h3 className="text-base font-bold text-[var(--text-primary)]">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>
    </motion.div>
  );
}

export default function About() {
  const { lang } = useLanguage();
  const t = TRANSLATIONS[lang];

  const [activeTab, setActiveTab] = useState('Biography');

  const TRAITS = [
    { icon: Cpu, title: t.trait1Title, description: t.trait1Desc, color: 'var(--accent-cyan)' },
    { icon: Zap, title: t.trait2Title, description: t.trait2Desc, color: 'var(--accent-blue)' },
    { icon: Users, title: t.trait3Title, description: t.trait3Desc, color: 'var(--accent-purple)' },
    { icon: GraduationCap, title: t.trait4Title, description: t.trait4Desc, color: 'var(--accent-green)' },
  ];

  const TABS = [
    { key: 'Biography', label: t.tabBio },
    { key: 'Career Goals', label: t.tabGoals },
    { key: 'Core Values', label: t.tabValues },
    { key: 'Learning', label: t.tabLearning },
  ];

  const TAB_CONTENT = {
    Biography: (
      <div className="space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
        <p>{t.bioParagraph1}</p>
        <p>{t.bioParagraph2}</p>
        <p>{t.bioParagraph3}</p>
      </div>
    ),
    'Career Goals': (
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 text-[var(--accent-cyan)] mt-0.5 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1">{t.goalShortTitle}</h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{t.goalShortDesc}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Award className="w-5 h-5 text-[var(--accent-blue)] mt-0.5 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1">{t.goalMidTitle}</h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{t.goalMidDesc}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Code2 className="w-5 h-5 text-[var(--accent-purple)] mt-0.5 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1">{t.goalLongTitle}</h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{t.goalLongDesc}</p>
          </div>
        </div>
      </div>
    ),
    'Core Values': (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: t.valueIntegrity, desc: t.valueIntegrityDesc },
          { label: t.valueCraft, desc: t.valueCraftDesc },
          { label: t.valueCuriosity, desc: t.valueCuriosityDesc },
          { label: t.valueReliability, desc: t.valueReliabilityDesc },
        ].map(v => (
          <div key={v.label} className="glass-sm p-4 rounded-xl space-y-1">
            <div className="text-sm font-bold gradient-text">{v.label}</div>
            <div className="text-xs text-[var(--text-muted)] leading-snug">{v.desc}</div>
          </div>
        ))}
      </div>
    ),
    Learning: (
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <BookOpen className="w-4 h-4 text-[var(--accent-cyan)] mt-0.5 shrink-0" />
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{t.learningDesc}</p>
        </div>
        <div className="space-y-2 mt-2">
          {[
            { label: t.learningLabelStudying, value: t.learningValueStudying },
            { label: t.learningLabelReading, value: t.learningValueReading },
            { label: t.learningLabelPracticing, value: t.learningValuePracticing },
            { label: t.learningLabelNextCert, value: t.learningValueNextCert },
          ].map(item => (
            <div key={item.label} className="flex items-baseline gap-2 text-xs">
              <span className="text-[var(--accent-cyan)] font-semibold shrink-0">{item.label}:</span>
              <span className="text-[var(--text-secondary)]">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  const COUNTERS = [
    { value: 5, suffix: '+', label: t.statProjects, color: 'var(--accent-cyan)' },
    { value: 4, suffix: '', label: t.statCertificates, color: 'var(--accent-blue)' },
    { value: 1500, suffix: '+', label: t.statHours, color: 'var(--accent-purple)' },
    { value: 3, suffix: '', label: t.statSpecializations, color: 'var(--accent-green)' },
  ];

  return (
    <section id="about" className="py-24 relative z-10" aria-labelledby="about-heading">
      <div className="max-w-6xl mx-auto px-6">

        {/* ── Section header ── */}
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
          }}
        >
          <span className="section-badge">{t.aboutBadge}</span>
          <h2 id="about-heading" className="section-title">
            {t.aboutTitle}{' '}
            <span className="gradient-text">{t.aboutTitleAccent}</span>
          </h2>
          <p className="section-subtitle mt-3">
            {t.aboutSubtitle}
          </p>
        </motion.div>

        {/* ── Traits grid ── */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: {
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {TRAITS.map((tr) => (
            <TraitCard key={tr.title} {...tr} />
          ))}
        </motion.div>

        {/* ── Tabbed bio ── */}
        <motion.div 
          className="glass-card mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
          }}
        >
          {/* Tab bar */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-[var(--border-glass)] pb-4">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeTab === tab.key
                    ? 'text-slate-950 font-bold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] glass-sm'
                }`}
                aria-selected={activeTab === tab.key}
                role="tab"
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-[var(--accent-cyan)] rounded-full shadow-[var(--glow-cyan)]"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {tab.label}
              </button>
            ))}
          </div>
          {/* Tab content */}
          <div role="tabpanel" className="relative min-h-[220px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {TAB_CONTENT[activeTab]}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Animated counters ── */}
        <motion.div 
          className="glass-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
          }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[var(--border-glass)]">
            {COUNTERS.map((c) => (
              <Counter key={c.label} {...c} />
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}

