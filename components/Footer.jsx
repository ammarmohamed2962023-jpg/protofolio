'use client';
import { ArrowUp, Mail, Lock } from 'lucide-react';
import { NAV_ITEMS, SITE } from '@/lib/utils';
import { motion } from 'framer-motion';

const GithubIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedinIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const TECH_STACK = ['Next.js', 'React 19', 'Tailwind CSS v4', 'JavaScript ES6+'];

export default function Footer({ onOpenAdmin }) {
  const year = new Date().getFullYear();

  return (
    <motion.footer
      className="border-t border-[var(--border-glass)] py-14 bg-[var(--bg-secondary)] relative z-10 no-print"
      role="contentinfo"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7 }}
    >
      <div className="max-w-6xl mx-auto px-6">

        {/* ── Top row ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <motion.div
                whileHover={{ scale: 1.08, rotate: 5 }}
                className="w-9 h-9 rounded-full flex items-center justify-center font-black text-white text-sm"
                style={{ background: 'var(--gradient-primary)' }}
              >
                AM
              </motion.div>
              <span className="text-base font-bold text-[var(--text-primary)]">Ammar Mohamed</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-xs">
              CS Student at Innovation University, specializing in Networking, Software Development, and AI.
            </p>
            <div className="flex items-center gap-2">
              <span className="status-dot" aria-hidden="true" />
              <span className="text-xs font-semibold text-[var(--accent-green)]">Open for Internship</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">Quick Links</h3>
            <nav className="grid grid-cols-2 gap-y-2 gap-x-4" aria-label="Footer navigation">
              {NAV_ITEMS.map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Built with */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">Built With</h3>
            <div className="flex flex-wrap gap-1.5">
              {TECH_STACK.map(t => (
                <span key={t} className="tag text-[9px]">{t}</span>
              ))}
            </div>
            <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
              Optimized for performance, accessibility, and SEO. <br />
              Last updated: {year}.
            </p>
          </div>
        </div>

        {/* ── Bottom row ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[var(--border-glass)]">

          <p className="text-xs text-[var(--text-muted)] text-center sm:text-left">
            © {year} Ammar Mohamed. All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            {/* Social links */}
            <motion.a
              whileHover={{ scale: 1.15, color: '#fff' }}
              whileTap={{ scale: 0.9 }}
              href={SITE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full glass-sm text-[var(--text-muted)] transition-colors"
              aria-label="GitHub profile"
            >
              <GithubIcon />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full glass-sm text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors"
              aria-label="LinkedIn profile"
            >
              <LinkedinIcon />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              href={`mailto:${SITE.email}`}
              className="p-2 rounded-full glass-sm text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors"
              aria-label="Send email"
            >
              <Mail className="w-4 h-4" />
            </motion.a>

            {/* Admin */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={onOpenAdmin}
              className="p-2 rounded-full glass-sm text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors"
              aria-label="Admin CMS panel"
              title="Admin CMS"
            >
              <Lock className="w-3.5 h-3.5" />
            </motion.button>

            {/* Back to top */}
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-2 rounded-full bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/25
                text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)] hover:text-slate-900 transition-colors"
              aria-label="Scroll back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}


