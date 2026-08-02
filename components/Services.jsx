'use client';
import { Monitor, Globe, Network, Headphones, Bot, Cog } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { TRANSLATIONS } from '@/lib/translations';

function ServiceCard({ icon: Icon, title, description, tags, color, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, borderColor: 'var(--border-glass-hover)' }}
      className="glass-card group flex flex-col gap-4 transition-colors text-left rtl:text-right"
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}
      >
        <Icon className="w-5 h-5" style={{ color }} aria-hidden="true" />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2 leading-snug group-hover:text-[var(--accent-cyan)] transition-colors">
          {title}
        </h3>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{description}</p>
      </div>
      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[var(--border-glass)]">
        {tags.map(tag => (
          <span key={tag} className="tag" style={{ color, borderColor: `${color}30`, background: `${color}10` }}>
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function Services() {
  const { lang } = useLanguage();
  const t = TRANSLATIONS[lang];

  const SERVICES = [
    {
      icon: Monitor,
      title: t.serviceDesktopTitle,
      description: t.serviceDesktopDesc,
      tags: ['C#', '.NET', 'SQL Server', 'WinForms'],
      color: 'var(--accent-purple)',
    },
    {
      icon: Globe,
      title: t.serviceWebTitle,
      description: t.serviceWebDesc,
      tags: ['Next.js', 'Tailwind', 'JavaScript', 'HTML5'],
      color: 'var(--accent-orange)',
    },
    {
      icon: Network,
      title: t.serviceNetworkingTitle,
      description: t.serviceNetworkingDesc,
      tags: ['Cisco IOS', 'OSPF', 'VLAN', 'ACL'],
      color: 'var(--accent-blue)',
    },
    {
      icon: Headphones,
      title: t.serviceSupportTitle,
      description: t.serviceSupportDesc,
      tags: ['Debugging', 'Networking', 'OS', 'Hardware'],
      color: 'var(--accent-cyan)',
    },
    {
      icon: Cog,
      title: t.serviceAutomationTitle,
      description: t.serviceAutomationDesc,
      tags: ['Python', 'C#', 'Scripting', 'Automation'],
      color: 'var(--accent-green)',
    },
    {
      icon: Bot,
      title: t.serviceAITitle,
      description: t.serviceAIDesc,
      tags: ['Python', 'ML', 'Scikit-Learn', 'OpenCV'],
      color: 'var(--accent-pink)',
    },
  ];

  return (
    <section id="services" className="py-24 relative z-10" aria-labelledby="services-heading">
      <div className="max-w-6xl mx-auto px-6">
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
          <span className="section-badge">{t.servicesBadge}</span>
          <h2 id="services-heading" className="section-title">
            {t.servicesTitle} <span className="gradient-text">{t.servicesTitleAccent}</span>
          </h2>
          <p className="section-subtitle mt-3">
            {t.servicesSubtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.title} {...s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

