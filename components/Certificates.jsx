'use client';
import { useState, useEffect } from 'react';
import { Award, ExternalLink, Copy, CheckCheck, Calendar, ShieldCheck } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { TRANSLATIONS } from '@/lib/translations';

const getBilingualText = (field, lang) => {
  if (typeof field === 'object' && field !== null) {
    return field[lang] || field.en || '';
  }
  return field || '';
};

function CertCard({ cert, index, onOpen, lang, t }) {
  const [copied, setCopied] = useState(false);

  const certTitle = getBilingualText(cert.title, lang);

  const handleCopy = async (e) => {
    e.stopPropagation();
    const ok = await copyToClipboard(cert.credential_id);
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, borderColor: 'var(--border-glass-hover)' }}
      className="glass-card group cursor-pointer flex flex-col gap-4 transition-colors text-left rtl:text-right"
      onClick={() => onOpen(cert)}
      aria-label={`View certificate: ${certTitle}`}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onOpen(cert)}
      role="button"
    >
      {/* Cert image */}
      <div className="h-36 rounded-xl overflow-hidden border border-[var(--border-glass)] relative">
        <img
          src={cert.image}
          alt={`${certTitle} certificate`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] via-transparent to-transparent" />
        <div className="absolute top-2 right-2 rtl:right-auto rtl:left-2">
          <span className="tag tag-green flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> {t.certsBadgeVerified}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 flex-1">
        <p className="text-[10px] font-bold text-[var(--accent-cyan)] uppercase tracking-wider">{cert.provider}</p>
        <h3 className="text-sm font-bold text-[var(--text-primary)] leading-snug group-hover:text-[var(--accent-cyan)] transition-colors">
          {certTitle}
        </h3>

        {/* Skills gained */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {cert.skills_gained?.slice(0, 3).map((s, i) => (
            <span key={i} className="tag text-[9px]">{getBilingualText(s, lang)}</span>
          ))}
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--border-glass)]">
        <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] font-mono">
          <Calendar className="w-3 h-3" />
          {cert.issue_date || 'N/A'}
        </div>
        <div className="flex items-center gap-2">
          {cert.credential_id && (
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg glass-sm text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-all"
              title={t.certsBtnCopy}
              aria-label={t.certsBtnCopy}
            >
              {copied ? <CheckCheck className="w-3.5 h-3.5 text-[var(--accent-green)]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
          {cert.verify_url && (
            <a
              href={cert.verify_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="p-1.5 rounded-lg glass-sm text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-all"
              aria-label={t.certsBtnVerify}
              title={t.certsBtnVerify}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function Certificates({ onOpenCertModal }) {
  const { lang } = useLanguage();
  const t = TRANSLATIONS[lang];

  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/certificates.json')
      .then(r => r.json())
      .then(d => { setCerts(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const totalSuffix = certs.length > 1 ? t.certsTotalCountSuffixPlural : t.certsTotalCountSuffix;

  return (
    <section id="certificates" className="py-24 relative z-10" aria-labelledby="certs-heading">
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
          <span className="section-badge">{t.certsBadge}</span>
          <h2 id="certs-heading" className="section-title">
            {t.certsTitle} <span className="gradient-text">{t.certsTitleAccent}</span>
          </h2>
          <p className="section-subtitle mt-3">
            {t.certsSubtitle}
          </p>
        </motion.div>

        {/* Cisco banner */}
        <motion.div 
          className="glass-card mb-10 flex flex-col sm:flex-row items-center gap-6"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-[var(--glow-blue)]"
            style={{ background: 'linear-gradient(135deg, #1a4fc4, #0e3a9e)' }}
            aria-hidden="true"
          >
            <Award className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1 text-center sm:text-left rtl:sm:text-right">
            <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">{t.certsAcademyTitle}</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {t.certsAcademyDesc}
            </p>
          </div>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://www.netacad.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary px-4 py-2 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" /> {t.certsAcademyBtn}
          </motion.a>
        </motion.div>

        {/* Grid */}
        <div className="min-h-[250px]">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              >
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="glass-card animate-pulse space-y-3">
                    <div className="h-36 rounded-xl bg-[var(--bg-glass-hover)]" />
                    <div className="h-3 w-1/2 rounded-full bg-[var(--bg-glass-hover)]" />
                    <div className="h-4 rounded-full bg-[var(--bg-glass-hover)]" />
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              >
                {certs.map((cert, i) => (
                  <CertCard key={cert.id} cert={cert} index={i} onOpen={onOpenCertModal} lang={lang} t={t} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Total count */}
        {certs.length > 0 && (
          <motion.p 
            className="text-center text-xs text-[var(--text-muted)] mt-8 font-mono"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            {certs.length} {totalSuffix} · {t.certsMoreComing}
          </motion.p>
        )}
      </div>
    </section>
  );
}

