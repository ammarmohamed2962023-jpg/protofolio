'use client';
import { useState, useEffect } from 'react';
import { Clock, Tag, ArrowRight, Search } from 'lucide-react';
import { useDebounce } from '@/lib/hooks';
import { truncate } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { TRANSLATIONS } from '@/lib/translations';

const getBilingualText = (field, lang) => {
  if (typeof field === 'object' && field !== null) {
    return field[lang] || field.en || '';
  }
  return field || '';
};

export default function BlogSection({ onOpenArticle }) {
  const { lang } = useLanguage();
  const t = TRANSLATIONS[lang];

  const [posts, setPosts]     = useState([]);
  const [filter, setFilter]   = useState('All');
  const [search, setSearch]   = useState('');
  const [loading, setLoading] = useState(true);
  const debouncedSearch       = useDebounce(search, 250);

  useEffect(() => {
    fetch('/data/blog.json')
      .then(r => r.json())
      .then(d => { setPosts(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(posts.map(p => getBilingualText(p.category, 'en')))];

  const filtered = posts.filter(p => {
    const pCatEn = getBilingualText(p.category, 'en');
    const pTitle = getBilingualText(p.title, lang);
    const pExcerpt = getBilingualText(p.excerpt || p.content, lang);

    const matchCat    = filter === 'All' || pCatEn === filter;
    const matchSearch = pTitle.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                        pExcerpt.toLowerCase().includes(debouncedSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = posts.find(p => p.featured);

  return (
    <section id="blog" className="py-24 relative z-10" aria-labelledby="blog-heading">
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
          <span className="section-badge">{lang === 'ar' ? 'مركز المعرفة' : 'Knowledge Hub'}</span>
          <h2 id="blog-heading" className="section-title">
            {lang === 'ar' ? 'مقالات وتطلعات' : 'Technical'} <span className="gradient-text">{lang === 'ar' ? 'تقنية' : 'Articles & Insights'}</span>
          </h2>
          <p className="section-subtitle mt-3">
            {lang === 'ar' 
              ? 'ملاحظات، دروس تعليمية، وتحليلات عميقة في الشبكات وهندسة البرمجيات والذكاء الاصطناعي.'
              : "Notes, tutorials, and deep-dives on networking, software engineering, and AI topics I'm actively exploring."}
          </p>
        </motion.div>

        {/* Featured article */}
        {featured && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card mb-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center cursor-pointer group text-left rtl:text-right"
            onClick={() => onOpenArticle(featured)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onOpenArticle(featured)}
            aria-label={`Featured article: ${getBilingualText(featured.title, lang)}`}
          >
            <div className="lg:col-span-5 h-52 rounded-xl overflow-hidden border border-[var(--border-glass)]">
              <img
                src={featured.cover_image || '/assets/images/blog-placeholder.png'}
                alt={getBilingualText(featured.title, lang)}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-2">
                <span className="tag tag-orange">{t.projectsFeaturedBadge}</span>
                <span className="tag">{getBilingualText(featured.category, lang)}</span>
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] leading-snug group-hover:text-[var(--accent-cyan)] transition-colors">
                {getBilingualText(featured.title, lang)}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {truncate(getBilingualText(featured.excerpt || featured.content, lang), 160)}
              </p>
              <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)] font-mono">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{getBilingualText(featured.read_time, lang)}</span>
                <span>{featured.date}</span>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent-cyan)] group-hover:gap-2 transition-all">
                {lang === 'ar' ? 'اقرأ المقال' : 'Read Article'} <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </span>
            </div>
          </motion.div>
        )}

        {/* Controls */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center gap-4 mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
          }}
        >
          <div className="flex flex-wrap gap-2 flex-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  filter === cat
                    ? 'text-slate-950 font-bold shadow-[var(--glow-cyan)]'
                    : 'glass-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {filter === cat && (
                  <motion.div
                    layoutId="blogTab"
                    className="absolute inset-0 bg-[var(--accent-cyan)] rounded-full"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {cat === 'All' ? (lang === 'ar' ? 'الكل' : 'All') : getBilingualText(posts.find(p => getBilingualText(p.category, 'en') === cat)?.category, lang) || cat}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" aria-hidden="true" />
            <input
              type="search"
              placeholder={lang === 'ar' ? 'ابحث في المقالات...' : 'Search articles...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input pl-9 rtl:pl-3 rtl:pr-9 text-xs rounded-full w-full"
              aria-label="Search blog articles"
            />
          </div>
        </motion.div>

        {/* Cards grid */}
        <motion.div layout className="min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {[1, 2, 3].map(i => (
                  <div key={i} className="glass-card animate-pulse space-y-3">
                    <div className="h-36 rounded-xl bg-[var(--bg-glass-hover)]" />
                    <div className="h-3 w-1/3 rounded-full bg-[var(--bg-glass-hover)]" />
                    <div className="h-4 rounded-full bg-[var(--bg-glass-hover)]" />
                    <div className="h-3 w-3/4 rounded-full bg-[var(--bg-glass-hover)]" />
                  </div>
                ))}
              </motion.div>
            ) : filtered.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 text-[var(--text-muted)] text-sm"
              >
                {lang === 'ar' ? 'لم يتم العثور على مقالات تطابق بحثك.' : 'No articles matched your search.'}
              </motion.div>
            ) : (
              <motion.div 
                key="grid"
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {filtered.map((post) => {
                    const postTitle = getBilingualText(post.title, lang);
                    const postExcerpt = getBilingualText(post.excerpt || post.content, lang);
                    const postCat = getBilingualText(post.category, lang);
                    const postReadTime = getBilingualText(post.read_time, lang);

                    return (
                      <motion.article
                        key={post.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ y: -5, borderColor: 'var(--border-glass-hover)' }}
                        className="glass-card group flex flex-col gap-3 cursor-pointer text-left rtl:text-right"
                        onClick={() => onOpenArticle(post)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => e.key === 'Enter' && onOpenArticle(post)}
                        aria-label={`Article: ${postTitle}`}
                      >
                        {post.cover_image && (
                          <div className="h-36 rounded-xl overflow-hidden border border-[var(--border-glass)] relative">
                            <img
                              src={post.cover_image}
                              alt={postTitle}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="tag">{postCat}</span>
                          {post.tags?.slice(0, 2).map(t => (
                            <span key={t} className="flex items-center gap-0.5 text-[9px] text-[var(--text-muted)]">
                              <Tag className="w-2.5 h-2.5" />{t}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-sm font-bold text-[var(--text-primary)] leading-snug group-hover:text-[var(--accent-cyan)] transition-colors flex-1">
                          {postTitle}
                        </h3>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                          {truncate(postExcerpt, 100)}
                        </p>
                        <div className="flex items-center justify-between pt-3 border-t border-[var(--border-glass)]">
                          <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)] font-mono">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{postReadTime}</span>
                            <span>{post.date}</span>
                          </div>
                          <span className="text-[10px] font-semibold text-[var(--accent-cyan)] flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                            {lang === 'ar' ? 'اقرأ' : 'Read'} <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                          </span>
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

