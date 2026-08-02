'use client';
import { useState, useEffect } from 'react';
import { Search, Layers, Star, ExternalLink, Calendar } from 'lucide-react';
import { useDebounce } from '@/lib/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { TRANSLATIONS } from '@/lib/translations';

const GithubIcon = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const STATUS_STYLE = {
  'Completed':    'tag-green',
  'In Progress':  'tag-blue',
  'Planned':      'tag-purple',
};

const getBilingualText = (field, lang) => {
  if (typeof field === 'object' && field !== null) {
    return field[lang] || field.en || '';
  }
  return field || '';
};

export default function Projects({ onOpenCaseStudy }) {
  const { lang } = useLanguage();
  const t = TRANSLATIONS[lang];

  const [projects, setProjects]     = useState([]);
  const [filter, setFilter]         = useState('all');
  const [sort, setSort]             = useState('featured');
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(true);
  const debouncedSearch             = useDebounce(search, 250);

  useEffect(() => {
    fetch('/data/projects.json')
      .then(r => r.json())
      .then(d => { setProjects(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const categories = ['all', ...new Set(projects.map(p => getBilingualText(p.category, 'en')))];

  const filtered = projects
    .filter(p => {
      const pCatEn = getBilingualText(p.category, 'en');
      const pTitle = getBilingualText(p.title, lang);
      const pDesc  = getBilingualText(p.description, lang);
      const matchCat    = filter === 'all' || pCatEn === filter;
      const matchSearch =
        pTitle.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        pDesc.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.technologies.some(tech => tech.toLowerCase().includes(debouncedSearch.toLowerCase()));
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sort === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      if (sort === 'latest')   return new Date(b.year || 0) - new Date(a.year || 0);
      return 0;
    });

  return (
    <section id="projects" className="py-24 bg-[var(--bg-secondary)]/30 relative z-10" aria-labelledby="projects-heading">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div 
          className="text-center mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
          }}
        >
          <span className="section-badge">{t.projectsBadge}</span>
          <h2 id="projects-heading" className="section-title">
            {t.projectsTitle} <span className="gradient-text">{t.projectsTitleAccent}</span>
          </h2>
          <p className="section-subtitle mt-3">
            {t.projectsSubtitle}
          </p>
        </motion.div>

        {/* ── Controls ── */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center gap-4 mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
          }}
        >
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 flex-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-full capitalize transition-all border ${
                  filter === cat
                    ? 'text-slate-950 font-bold border-transparent shadow-[var(--glow-cyan)]'
                    : 'glass-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {filter === cat && (
                  <motion.div
                    layoutId="projectTab"
                    className="absolute inset-0 bg-[var(--accent-cyan)] rounded-full"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {cat === 'all' ? t.projectsCategoryAll : (
                  // find representative project to get localized category
                  getBilingualText(projects.find(p => getBilingualText(p.category, 'en') === cat)?.category, lang) || cat
                )}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="form-input w-auto text-xs rounded-full px-3 py-2 cursor-pointer"
            aria-label={t.projectsSortLabel}
          >
            <option value="featured">{t.projectsSortFeatured}</option>
            <option value="latest">{t.projectsSortLatest}</option>
          </select>

          {/* Search */}
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" aria-hidden="true" />
            <input
              type="search"
              placeholder={t.projectsSearchPlaceholder}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input pl-9 rtl:pl-3 rtl:pr-9 text-xs rounded-full w-full"
              aria-label={t.projectsSearchPlaceholder}
            />
          </div>
        </motion.div>

        {/* ── Skeleton / Empty / Grid ── */}
        <motion.div layout className="min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="glass-card animate-pulse space-y-4">
                    <div className="h-44 rounded-xl bg-[var(--bg-glass-hover)]" />
                    <div className="h-4 w-3/4 rounded-full bg-[var(--bg-glass-hover)]" />
                    <div className="h-3 rounded-full bg-[var(--bg-glass-hover)]" />
                    <div className="h-3 w-2/3 rounded-full bg-[var(--bg-glass-hover)]" />
                  </div>
                ))}
              </motion.div>
            ) : filtered.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20 text-[var(--text-muted)] text-sm"
              >
                {t.projectsEmpty}
              </motion.div>
            ) : (
              <motion.div 
                key="grid"
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {filtered.map((project) => {
                    const titleStr = getBilingualText(project.title, lang);
                    const descStr  = getBilingualText(project.description, lang);
                    const statusStr = getBilingualText(project.status, lang);

                    return (
                      <motion.article
                        key={project.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="glass-card flex flex-col justify-between group text-left rtl:text-right"
                        aria-label={`Project: ${titleStr}`}
                      >
                        {/* Image */}
                        <div className="h-44 rounded-xl overflow-hidden mb-4 border border-[var(--border-glass)] relative">
                          <img
                            src={project.image}
                            alt={`Screenshot of ${titleStr}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          {/* Overlay badges */}
                          <div className="absolute top-2 left-2 rtl:left-auto rtl:right-2 flex gap-1.5">
                            {project.featured && (
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[var(--accent-cyan)] text-slate-900">
                                <Star className="w-2.5 h-2.5" /> {t.projectsFeaturedBadge}
                              </span>
                            )}
                            {statusStr && (
                              <span className={`tag ${STATUS_STYLE[getBilingualText(project.status, 'en')] || ''}`}>
                                {statusStr}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Tech tags */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {project.technologies.slice(0, 3).map((tech, j) => (
                            <span key={j} className="tag">{tech}</span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="tag text-[var(--text-muted)] border-[var(--border-glass)]">
                              +{project.technologies.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Title + description */}
                        <h3 className="text-base font-bold text-[var(--text-primary)] mb-2 leading-snug">
                          {titleStr}
                        </h3>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-5 flex-1">
                          {descStr}
                        </p>

                        {/* Year */}
                        {project.year && (
                          <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] mb-3 font-mono">
                            <Calendar className="w-3 h-3" />
                            {project.year}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-4 border-t border-[var(--border-glass)]">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onOpenCaseStudy(project)}
                            className="btn-secondary flex-1 px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                            aria-label={`View case study for ${titleStr}`}
                          >
                            <Layers className="w-3.5 h-3.5" /> {t.projectsBtnCaseStudy}
                          </motion.button>
                          {project.github && project.github !== '#' && (
                            <motion.a
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-secondary px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                              aria-label={`View ${titleStr} on GitHub`}
                            >
                              <GithubIcon /> {t.projectsBtnGitHub}
                            </motion.a>
                          )}
                          {project.demo && project.demo !== '#' && (
                            <motion.a
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              href={project.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-secondary px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                              aria-label={`View live demo of ${titleStr}`}
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> {t.projectsBtnDemo}
                            </motion.a>
                          )}
                        </div>
                      </motion.article>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

