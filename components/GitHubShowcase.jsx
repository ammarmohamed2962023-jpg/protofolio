'use client';
import { Star, GitFork, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { TRANSLATIONS } from '@/lib/translations';

const GithubIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

function RepoCard({ repo, index }) {
  return (
    <motion.a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6, borderColor: 'var(--border-glass-hover)' }}
      className="glass-card flex flex-col gap-3 group transition-colors text-left rtl:text-right"
      aria-label={`GitHub repository: ${repo.name}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors leading-snug">
          {repo.name}
        </h3>
        <ExternalLink className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0 mt-0.5 group-hover:text-[var(--accent-cyan)] transition-colors" aria-hidden="true" />
      </div>

      <p className="text-xs text-[var(--text-secondary)] leading-relaxed flex-1">{repo.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {repo.topics.map(t => (
          <span key={t} className="tag text-[9px]">{t}</span>
        ))}
      </div>

      <div className="flex items-center gap-4 pt-2 border-t border-[var(--border-glass)]">
        <span className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: repo.langColor }} aria-hidden="true" />
          {repo.language}
        </span>
        <span className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
          <Star className="w-3 h-3" aria-hidden="true" /> {repo.stars}
        </span>
        <span className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
          <GitFork className="w-3 h-3" aria-hidden="true" /> {repo.forks}
        </span>
      </div>
    </motion.a>
  );
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function GitHubShowcase() {
  const { lang } = useLanguage();
  const t = TRANSLATIONS[lang];

  const GITHUB_STATS = [
    { label: t.githubStatRepos, value: '—', note: t.githubStatReposNote, color: 'var(--accent-cyan)' },
    { label: t.githubStatStars, value: '—', note: t.githubStatStarsNote, color: 'var(--accent-orange)' },
    { label: t.githubStatFollowers, value: '—', note: t.githubStatFollowersNote, color: 'var(--accent-purple)' },
    { label: t.githubStatContribs, value: '—', note: t.githubStatContribsNote, color: 'var(--accent-green)' },
  ];

  const PINNED_REPOS = [
    {
      name: 'ALASAR-Pharmacy-System',
      description: lang === 'ar'
        ? 'تطبيق سطح مكتب لإدارة الصيدليات تم بناؤه بلغة C# WinForms وقواعد بيانات SQL Server وقارئ الباركود وتقارير RDLC.'
        : 'Enterprise pharmacy management desktop application built with C# WinForms, SQL Server, barcode scanning, and RDLC reporting.',
      language: 'C#',
      langColor: '#a855f7',
      stars: '—',
      forks: '—',
      url: 'https://github.com/ammar-mohamed',
      topics: ['csharp', 'sql-server', 'winforms', 'pos'],
    },
    {
      name: 'Student-Management-System',
      description: lang === 'ar'
        ? 'نظام جافا أكاديمي قائم على البرمجة كائنية التوجه مع MySQL وحساب المعدل التراكمي ومتابعة التسجيل.'
        : 'Java OOP academic management system with MySQL integration, GPA calculation, enrollment tracking, and grade reporting.',
      language: 'Java',
      langColor: '#f59e0b',
      stars: '—',
      forks: '—',
      url: 'https://github.com/ammar-mohamed',
      topics: ['java', 'oop', 'mysql', 'javafx'],
    },
    {
      name: 'Cisco-Network-Enterprise-Lab',
      description: lang === 'ar'
        ? 'محاكاة كاملة لشبكة مؤسسة في Cisco Packet Tracer — تشمل OSPF و VLANs وجدار حماية ACL وتقسيم العناوين.'
        : 'Full enterprise network topology simulation in Cisco Packet Tracer — OSPF, VLANs, ACL firewall, and IPv4/IPv6 subnetting.',
      language: 'Cisco IOS',
      langColor: '#3b82f6',
      stars: '—',
      forks: '—',
      url: 'https://github.com/ammar-mohamed',
      topics: ['cisco', 'networking', 'ospf', 'vlan'],
    },
    {
      name: 'portfolio-v3',
      description: lang === 'ar'
        ? 'موقع معرض الأعمال الشخصي تم بناؤه باستخدام Next.js App Router و Tailwind CSS وانيميشن متقدم.'
        : 'Personal brand portfolio built with Next.js App Router, Tailwind CSS, and advanced animations — this website.',
      language: 'JavaScript',
      langColor: '#f59e0b',
      stars: '—',
      forks: '—',
      url: 'https://github.com/ammar-mohamed',
      topics: ['nextjs', 'tailwind', 'portfolio'],
    },
  ];

  return (
    <section id="github" className="py-24 relative z-10" aria-labelledby="github-heading">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeUp}
        >
          <span className="section-badge">{t.githubBadge}</span>
          <h2 id="github-heading" className="section-title">
            {t.githubTitle} <span className="gradient-text">{t.githubTitleAccent}</span>
          </h2>
          <p className="section-subtitle mt-3">
            {t.githubSubtitle}
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="glass-card grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-y lg:divide-y-0 divide-[var(--border-glass)] mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {GITHUB_STATS.map(stat => (
            <motion.div key={stat.label} variants={fadeUp} className="p-5 text-center">
              <div className="text-2xl font-black font-mono" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-[var(--text-primary)] mt-1">{stat.label}</div>
              <div className="text-[9px] text-[var(--text-muted)] mt-0.5">{stat.note}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pinned repos grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {PINNED_REPOS.map((repo, i) => (
            <RepoCard key={repo.name} repo={repo} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.a
            href="https://github.com/ammar-mohamed"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="btn-secondary inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm"
            aria-label={t.githubBtnProfile}
          >
            <GithubIcon />
            {t.githubBtnProfile}
          </motion.a>
          <p className="text-[10px] text-[var(--text-muted)] mt-3">
            {t.githubWarning}
          </p>
        </motion.div>
      </div>
    </section>
  );
}


