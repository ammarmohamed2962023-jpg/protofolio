'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { useDebounce } from '@/lib/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { TRANSLATIONS } from '@/lib/translations';

/* ── Static skills data ── */
const ALL_SKILLS = [
  /* Programming */
  { name: 'C# (.NET WinForms / OOP)',    level: 90, years: 2, category: 'Programming', color: 'var(--accent-purple)' },
  { name: 'Java (OOP & Swing / JavaFX)', level: 88, years: 2, category: 'Programming', color: 'var(--accent-orange)' },
  { name: 'C++ (Data Structures)',        level: 82, years: 1, category: 'Programming', color: 'var(--accent-blue)' },
  { name: 'Python (Scripting / AI)',      level: 70, years: 1, category: 'Programming', color: 'var(--accent-cyan)' },
  { name: 'JavaScript (ES6+)',            level: 84, years: 1, category: 'Programming', color: 'var(--accent-orange)' },
  /* Web */
  { name: 'HTML5 & CSS3',                level: 92, years: 2, category: 'Web',         color: 'var(--accent-orange)' },
  { name: 'Next.js (App Router)',         level: 72, years: 1, category: 'Web',         color: 'var(--text-primary)' },
  { name: 'Tailwind CSS',                 level: 78, years: 1, category: 'Web',         color: 'var(--accent-cyan)' },
  /* Networking */
  { name: 'Cisco Router & Switch Config', level: 90, years: 2, category: 'Networking',  color: 'var(--accent-blue)' },
  { name: 'TCP/IP & OSI Model',           level: 93, years: 2, category: 'Networking',  color: 'var(--accent-cyan)' },
  { name: 'OSPF / RIP Routing Protocols', level: 86, years: 1, category: 'Networking',  color: 'var(--accent-green)' },
  { name: 'VLAN & Inter-VLAN Routing',    level: 85, years: 1, category: 'Networking',  color: 'var(--accent-blue)' },
  { name: 'IP Subnetting (IPv4/IPv6)',     level: 95, years: 2, category: 'Networking',  color: 'var(--accent-purple)' },
  { name: 'ACL Firewall Rules',           level: 80, years: 1, category: 'Networking',  color: 'var(--accent-orange)' },
  /* Database */
  { name: 'SQL Server (T-SQL)',           level: 85, years: 2, category: 'Database',    color: 'var(--accent-blue)' },
  { name: 'MySQL',                         level: 75, years: 1, category: 'Database',    color: 'var(--accent-orange)' },
  /* Tools */
  { name: 'Git & GitHub',                 level: 88, years: 2, category: 'Tools',       color: 'var(--text-primary)' },
  { name: 'Cisco Packet Tracer',          level: 92, years: 2, category: 'Tools',       color: 'var(--accent-blue)' },
  { name: 'Visual Studio',               level: 90, years: 2, category: 'Tools',       color: 'var(--accent-purple)' },
  { name: 'VS Code',                      level: 92, years: 2, category: 'Tools',       color: 'var(--accent-blue)' },
  /* Soft Skills */
  { name: 'Problem Solving',              level: 90, years: 0, category: 'Soft Skills', color: 'var(--accent-cyan)' },
  { name: 'Team Collaboration',           level: 85, years: 0, category: 'Soft Skills', color: 'var(--accent-green)' },
  { name: 'Technical Communication',      level: 82, years: 0, category: 'Soft Skills', color: 'var(--accent-blue)' },
  { name: 'Continuous Learning',          level: 95, years: 0, category: 'Soft Skills', color: 'var(--accent-purple)' },
];

const CAT_COLORS = {
  All:          'var(--accent-cyan)',
  Programming:  'var(--accent-purple)',
  Web:          'var(--accent-orange)',
  Networking:   'var(--accent-blue)',
  Database:     'var(--accent-blue)',
  Tools:        'var(--accent-green)',
  'Soft Skills':'var(--accent-cyan)',
};

/* ── Animated progress bar ── */
function SkillBar({ name, level, years, color, lang, t }) {
  const yearsSuffix = years > 1 ? t.skillsYearsSuffixPlural : t.skillsYearsSuffixSingular;

  return (
    <motion.div 
      className="space-y-1.5"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-[var(--text-primary)]">{name}</span>
        <div className="flex items-center gap-2">
          {years > 0 && (
            <span className="text-[9px] font-medium text-[var(--text-muted)] font-mono">{years} {yearsSuffix}</span>
          )}
          <span className="font-mono" style={{ color }}>{level}%</span>
        </div>
      </div>
      <div className="skill-bar-track">
        <motion.div
          className="skill-bar-fill"
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            background: `linear-gradient(90deg, ${color}, var(--accent-blue))`,
            boxShadow: `0 0 8px ${color}80`,
          }}
        />
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const { lang } = useLanguage();
  const t = TRANSLATIONS[lang];

  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch]                 = useState('');
  const debouncedSearch                     = useDebounce(search, 250);

  const CATEGORIES = [
    { key: 'All', label: t.skillsCategoryAll },
    { key: 'Programming', label: t.skillsCategoryProgramming },
    { key: 'Web', label: t.skillsCategoryWeb },
    { key: 'Networking', label: t.skillsCategoryNetworking },
    { key: 'Database', label: t.skillsCategoryDatabase },
    { key: 'Tools', label: t.skillsCategoryTools },
    { key: 'Soft Skills', label: t.skillsCategorySoftSkills },
  ];

  const categoryLabelMap = CATEGORIES.reduce((acc, c) => ({ ...acc, [c.key]: c.label }), {});

  const filtered = ALL_SKILLS.filter(s => {
    const matchCat    = activeCategory === 'All' || s.category === activeCategory;
    const matchSearch = s.name.toLowerCase().includes(debouncedSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  /* Group by category for display */
  const grouped = filtered.reduce((acc, skill) => {
    (acc[skill.category] = acc[skill.category] || []).push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="py-24 bg-[var(--bg-secondary)]/30 relative z-10" aria-labelledby="skills-heading">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div 
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <span className="section-badge">{t.skillsBadge}</span>
          <h2 id="skills-heading" className="section-title">
            {t.skillsTitle} <span className="gradient-text">{t.skillsTitleAccent}</span>
          </h2>
          <p className="section-subtitle mt-3">
            {t.skillsSubtitle}
          </p>
        </motion.div>

        {/* ── Filter + Search ── */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Category filter */}
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Skill categories">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                role="tab"
                aria-selected={activeCategory === cat.key}
                className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all border ${
                  activeCategory === cat.key
                    ? 'text-slate-950 font-bold border-transparent shadow-[var(--glow-cyan)]'
                    : 'glass-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {activeCategory === cat.key && (
                  <motion.div
                    layoutId="skillsTab"
                    className="absolute inset-0 rounded-full"
                    style={{ background: CAT_COLORS[cat.key], zIndex: -1 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" aria-hidden="true" />
            <input
              type="search"
              placeholder={t.skillsSearchPlaceholder}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input pl-9 rtl:pl-3 rtl:pr-9 text-xs rounded-full"
              aria-label={t.skillsSearchPlaceholder}
            />
          </div>
        </motion.div>

        {/* ── Skill groups ── */}
        <motion.div layout className="min-h-[300px]">
          <AnimatePresence mode="popLayout">
            {Object.keys(grouped).length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 text-[var(--text-muted)] text-sm"
              >
                {t.skillsEmpty}
              </motion.div>
            ) : (
              <motion.div 
                key="grid"
                layout
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <AnimatePresence>
                  {Object.entries(grouped).map(([category, skills]) => (
                    <motion.div 
                      key={category} 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="glass-card space-y-5"
                    >
                      <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--border-glass)]">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: CAT_COLORS[category], boxShadow: `0 0 8px ${CAT_COLORS[category]}` }}
                        />
                        <h3 className="text-sm font-bold text-[var(--text-primary)]">{categoryLabelMap[category] || category}</h3>
                        <span className="ml-auto rtl:ml-0 rtl:mr-auto text-[10px] tag">{skills.length}</span>
                      </div>
                      <div className="space-y-4">
                        {skills.map((skill) => (
                          <SkillBar key={skill.name} {...skill} lang={lang} t={t} />
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

