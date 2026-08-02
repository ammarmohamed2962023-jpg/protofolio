'use client';
import { GraduationCap, Code2, Award, BookOpen, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { TRANSLATIONS } from '@/lib/translations';

const CAT_STYLE = {
  Education:   'tag-cyan',
  Project:     'tag-purple',
  Certificate: 'tag-blue',
  Goal:        'tag-green',
};

function TimelineItem({ item, index, lang }) {
  const isRight = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 100 }}
      className={`relative flex items-start gap-4 ${isRight ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
    >
      {/* Content card */}
      <motion.div 
        whileHover={{ y: -5, borderColor: 'var(--border-glass-hover)' }}
        className={`flex-1 glass-card ${isRight ? 'lg:text-left rtl:lg:text-right' : 'lg:text-right rtl:lg:text-left'} text-left rtl:text-right`}
      >
        <div className={`flex items-center gap-2 mb-3 ${isRight ? '' : 'lg:justify-end rtl:lg:justify-start'}`}>
          <span className={`tag ${CAT_STYLE[item.categoryKey] || 'tag-green'} text-[9px]`}>{item.category}</span>
          <span className="text-xs font-mono font-bold" style={{ color: item.color }}>{item.year}</span>
        </div>
        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2 leading-snug">{item.title}</h3>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{item.description}</p>
      </motion.div>

      {/* Center dot (desktop only) */}
      <div className="hidden lg:flex flex-col items-center gap-1 shrink-0">
        <motion.div
          whileHover={{ scale: 1.2, rotate: 360 }}
          transition={{ duration: 0.6 }}
          className="w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-lg"
          style={{
            borderColor: item.color,
            background: `${item.color}15`,
            boxShadow: `0 0 16px ${item.color}50`,
          }}
        >
          <item.icon className="w-4 h-4" style={{ color: item.color }} aria-hidden="true" />
        </motion.div>
      </div>

      {/* Spacer for alternating layout */}
      <div className="hidden lg:block flex-1" />
    </motion.div>
  );
}

export default function Timeline() {
  const { lang } = useLanguage();
  const t = TRANSLATIONS[lang];

  const TIMELINE = [
    {
      year: '2023',
      icon: GraduationCap,
      color: 'var(--accent-cyan)',
      categoryKey: 'Education',
      category: lang === 'ar' ? 'التعليم' : 'Education',
      title: lang === 'ar' ? 'بدء دراسة علوم الحاسب بجامعة الابتكار' : 'Started Computer Science at Innovation University',
      description: lang === 'ar' ? 'التحقت بكلية الحاسبات والمعلومات، لبدء رحلتي الرسمية في الخوارزميات، هياكل البيانات، وبنية الحاسب.' : 'Enrolled in the Faculty of Computers and Information, beginning my formal journey into algorithms, data structures, and computer architecture.',
    },
    {
      year: '2024',
      icon: Code2,
      color: 'var(--accent-purple)',
      categoryKey: 'Project',
      category: lang === 'ar' ? 'مشروع' : 'Project',
      title: lang === 'ar' ? 'بناء نظام "الأعصار" لإدارة الصيدليات' : 'Built ALASAR Pharmacy Management System',
      description: lang === 'ar' ? 'تطوير نظام مكتب كامل لمؤسسة بلغة C# وقواعد بيانات SQL Server، يشتمل على قراءة الباركود، الفواتير، وتقارير RDLC.' : 'Developed a full desktop enterprise system in C# with SQL Server, barcode scanning, POS billing, and RDLC reports — a complete real-world solution.',
    },
    {
      year: '2024',
      icon: Award,
      color: 'var(--accent-blue)',
      categoryKey: 'Certificate',
      category: lang === 'ar' ? 'شهادة' : 'Certificate',
      title: lang === 'ar' ? 'الحصول على شهادات سيسكو المعتمدة للشبكات' : 'Earned Cisco Networking Certifications',
      description: lang === 'ar' ? 'إكمال عدة دورات من أكاديمية سيسكو تشمل أساسيات الشبكات، عناوين الشبكات، واللغة الإنجليزية لتكنولوجيا المعلومات.' : 'Completed multiple Cisco Networking Academy courses including Networking Basics, Network Addressing, and English for IT through official Netacad platform.',
    },
    {
      year: '2024',
      icon: BookOpen,
      color: 'var(--accent-green)',
      categoryKey: 'Project',
      category: lang === 'ar' ? 'مشروع' : 'Project',
      title: lang === 'ar' ? 'بناء نظام إدارة الطلاب بلغة جافا' : 'Built Student Management System in Java',
      description: lang === 'ar' ? 'تصميم وتنفيذ نظام أكاديمي مبني على OOP بلغة Java مع MySQL، لتسجيل الطلاب وحساب المعدل التراكمي GPA.' : 'Designed and implemented an OOP-based academic system in Java with MySQL, enrollment tracking, GPA calculation, and grade reporting.',
    },
    {
      year: '2025',
      icon: Code2,
      color: 'var(--accent-orange)',
      categoryKey: 'Project',
      category: lang === 'ar' ? 'مشروع' : 'Project',
      title: lang === 'ar' ? 'بناء معرض الأعمال الشخصي v3.0 (Next.js)' : 'Built Personal Portfolio v3.0 (Next.js)',
      description: lang === 'ar' ? 'تطوير هذه المنصة باستخدام Next.js App Router و Tailwind CSS وانيميشن متقدم لتكون واجهة احترافية متكاملة.' : 'Developed this portfolio platform using Next.js App Router, Tailwind CSS, and advanced animations — a full production-grade personal brand website.',
    },
    {
      year: '2025 →',
      icon: Rocket,
      color: 'var(--accent-pink)',
      categoryKey: 'Goal',
      category: lang === 'ar' ? 'هدف' : 'Goal',
      title: lang === 'ar' ? 'السعي نحو التدريب العملي وشهادة CCNA' : 'Pursuing Internship & CCNA Certification',
      description: lang === 'ar' ? 'البحث النشط عن فرص تدريب في هندسة البرمجيات مع الدراسة لنيل شهادة CCNA والتوسع في الحوسبة السحابية.' : 'Actively seeking software engineering internships while studying toward the CCNA certification and expanding into cloud computing and AI applications.',
    },
  ];

  return (
    <section id="timeline" className="py-24 bg-[var(--bg-secondary)]/30 relative z-10" aria-labelledby="timeline-heading">
      <div className="max-w-4xl mx-auto px-6">
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
          <span className="section-badge">{t.timelineBadge}</span>
          <h2 id="timeline-heading" className="section-title">
            {t.timelineTitle} <span className="gradient-text">{t.timelineTitleAccent}</span>
          </h2>
          <p className="section-subtitle mt-3">
            {t.timelineSubtitle}
          </p>
        </motion.div>

        <div className="flex flex-col gap-8">
          {TIMELINE.map((item, i) => (
            <TimelineItem key={i} item={item} index={i} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}

