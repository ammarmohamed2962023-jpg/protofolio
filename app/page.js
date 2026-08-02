'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Static imports (above the fold) ── */
import ParticlesBg     from '@/components/ParticlesBg';
import Navbar          from '@/components/Navbar';
import Hero            from '@/components/Hero';
import About           from '@/components/About';
import Skills          from '@/components/Skills';
import Services        from '@/components/Services';
import Projects        from '@/components/Projects';
import Certificates    from '@/components/Certificates';
import Timeline        from '@/components/Timeline';
import GitHubShowcase  from '@/components/GitHubShowcase';
import BlogSection     from '@/components/BlogSection';
import ContactSection  from '@/components/ContactSection';
import Footer          from '@/components/Footer';
import GlobalModal     from '@/components/GlobalModal';

/* ── Dynamic imports (below the fold / heavy) ── */
const AIAssistant  = dynamic(() => import('@/components/AIAssistant'),  { ssr: false });
const TerminalModal = dynamic(() => import('@/components/TerminalModal'), { ssr: false });
const AdminModal   = dynamic(() => import('@/components/AdminModal'),   { ssr: false });

import { Download, Layers, CheckCircle2, ExternalLink, CheckCheck, Copy } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';

/* ── Toast component ── */
function Toast({ toast }) {
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.message + toast.type}
          className={`toast toast-${toast.type || 'info'} no-print`}
          role="alert"
          aria-live="polite"
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
        >
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              toast.type === 'success' ? 'bg-[var(--accent-green)] text-white' :
              toast.type === 'error'   ? 'bg-red-500 text-white' :
                                         'bg-[var(--accent-cyan)] text-slate-900'
            }`}
            aria-hidden="true"
          >
            {icons[toast.type] || icons.info}
          </span>
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Project Case Study Modal Content ── */
function ProjectModal({ project }) {
  if (!project) return null;
  return (
    <div className="space-y-6">
      <div className="h-64 rounded-2xl overflow-hidden border border-[var(--border-glass)]">
        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          {project.featured && (
            <span className="tag tag-orange text-[10px]">⭐ Featured</span>
          )}
          {project.status && (
            <span className="tag tag-green text-[10px]">{project.status}</span>
          )}
          {project.year && (
            <span className="text-xs font-mono text-[var(--text-muted)]">{project.year}</span>
          )}
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">{project.title}</h2>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {project.technologies.map((t, i) => (
            <span key={i} className="tag">{t}</span>
          ))}
        </div>
      </div>

      <div className="space-y-5 text-sm text-[var(--text-secondary)] leading-relaxed">
        {[
          { label: 'Problem Statement', value: project.problem },
          { label: 'Solution Approach', value: project.solution },
          { label: 'Architecture',      value: project.architecture },
        ].filter(s => s.value).map(s => (
          <div key={s.label}>
            <h4 className="text-sm font-bold text-[var(--accent-cyan)] mb-1">{s.label}</h4>
            <p>{s.value}</p>
          </div>
        ))}

        {project.features?.length > 0 && (
          <div>
            <h4 className="text-sm font-bold text-[var(--accent-cyan)] mb-2">Key Features</h4>
            <ul className="space-y-1.5">
              {project.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent-green)] mt-0.5 shrink-0" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {project.challenges && (
          <div>
            <h4 className="text-sm font-bold text-[var(--accent-cyan)] mb-1">Challenges &amp; Lessons</h4>
            <p>{project.challenges}</p>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t border-[var(--border-glass)] justify-end">
        {project.github && project.github !== '#' && (
          <a href={project.github} target="_blank" rel="noopener noreferrer"
            className="btn-primary px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5">
            GitHub Repo
          </a>
        )}
        {project.demo && project.demo !== '#' && (
          <a href={project.demo} target="_blank" rel="noopener noreferrer"
            className="btn-secondary px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5" /> Live Demo
          </a>
        )}
      </div>
    </div>
  );
}

/* ── Certificate Modal Content ── */
function CertModal({ cert }) {
  const [copied, setCopied] = useState(false);
  if (!cert) return null;

  const handleCopy = async () => {
    await copyToClipboard(cert.credential_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-center">
      <div className="h-52 rounded-2xl overflow-hidden border border-[var(--border-glass)]">
        <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
      </div>
      <div>
        <p className="text-xs font-bold text-[var(--accent-cyan)] uppercase tracking-wider mb-2">{cert.provider}</p>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">{cert.title}</h2>
      </div>

      {cert.issue_date && (
        <p className="text-xs text-[var(--text-muted)]">Issued: <strong className="text-[var(--text-primary)]">{cert.issue_date}</strong></p>
      )}

      <div className="flex flex-wrap justify-center gap-1.5">
        {cert.skills_gained?.map((s, i) => (
          <span key={i} className="tag">{s}</span>
        ))}
      </div>

      {cert.credential_id && (
        <div className="flex items-center justify-center gap-2 font-mono text-xs text-[var(--text-secondary)]">
          <span>Credential ID: <strong className="text-[var(--text-primary)]">{cert.credential_id}</strong></span>
          <button onClick={handleCopy} className="p-1.5 rounded-lg glass-sm text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-all" aria-label="Copy credential ID">
            {copied ? <CheckCheck className="w-3.5 h-3.5 text-[var(--accent-green)]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}

      <div className="pt-4 border-t border-[var(--border-glass)] flex justify-center gap-3">
        {cert.verify_url && (
          <a href={cert.verify_url} target="_blank" rel="noopener noreferrer"
            className="btn-primary px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5" /> Verify Credential
          </a>
        )}
      </div>
    </div>
  );
}

/* ── Resume Modal Content ── */
function ResumeModal() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-[var(--border-glass)] pb-5">
        <div>
          <h2 className="text-2xl font-black text-[var(--text-primary)]">Ammar Mohamed</h2>
          <p className="text-xs font-semibold text-[var(--accent-cyan)] mt-0.5">
            CS Student · Networking · Software Development · AI
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">ammar.mohamed.cs@gmail.com</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <a href="/assets/cv/cv_ammar_mohamed.pdf" download
            className="btn-primary px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Download PDF
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
        <div className="space-y-5">
          <div>
            <h4 className="text-xs font-bold text-[var(--accent-cyan)] uppercase tracking-wider mb-2">Education</h4>
            <p className="font-semibold text-[var(--text-primary)]">Innovation University</p>
            <p className="text-xs text-[var(--text-secondary)]">Faculty of Computers &amp; Information</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">BSc Computer Science · Expected 2027</p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-[var(--accent-cyan)] uppercase tracking-wider mb-2">Certifications</h4>
            {['Cisco Networking Academy', 'English for IT (Cisco)', 'Networking Basics', 'Network Addressing'].map(c => (
              <p key={c} className="text-xs text-[var(--text-secondary)] mb-0.5 flex items-start gap-1.5">
                <span className="text-[var(--accent-green)] mt-0.5">✓</span> {c}
              </p>
            ))}
          </div>
          <div>
            <h4 className="text-xs font-bold text-[var(--accent-cyan)] uppercase tracking-wider mb-2">Status</h4>
            <span className="status-open text-[10px]">
              <span className="status-dot" /> Open for Internship
            </span>
          </div>
        </div>

        <div className="sm:col-span-2 space-y-5">
          <div>
            <h4 className="text-xs font-bold text-[var(--accent-cyan)] uppercase tracking-wider mb-2">Professional Summary</h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Dedicated Computer Science student with proven experience in enterprise C# desktop development, SQL Server architecture,
              Java OOP systems, and Cisco network design. Passionate about building reliable software and well-structured networks.
              Seeking an internship to apply these skills in a professional environment.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-[var(--accent-cyan)] uppercase tracking-wider mb-2">Featured Projects</h4>
            {[
              { name: 'ALASAR Pharmacy Management System', desc: 'C# WinForms + SQL Server, POS, barcode scanning, RDLC reports.' },
              { name: 'Student Management System',         desc: 'Java OOP + MySQL, GPA calculation, grade tracking, enrollment.' },
              { name: 'Cisco Enterprise Network Lab',      desc: 'OSPF, VLAN, ACL, subnetting in Cisco Packet Tracer.' },
            ].map(p => (
              <div key={p.name} className="mb-3">
                <p className="text-xs font-semibold text-[var(--text-primary)]">{p.name}</p>
                <p className="text-[10px] text-[var(--text-secondary)]">{p.desc}</p>
              </div>
            ))}
          </div>
          <div>
            <h4 className="text-xs font-bold text-[var(--accent-cyan)] uppercase tracking-wider mb-2">Core Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {['C# .NET', 'Java', 'C++', 'SQL Server', 'Cisco IOS', 'TCP/IP', 'JavaScript', 'Next.js', 'Git'].map(s => (
                <span key={s} className="tag text-[10px]">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Blog Article Modal Content ── */
function ArticleModal({ post }) {
  if (!post) return null;
  return (
    <div className="space-y-5">
      <div className="border-b border-[var(--border-glass)] pb-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="tag">{post.category}</span>
          {post.featured && <span className="tag tag-orange">Featured</span>}
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] leading-snug">{post.title}</h2>
        <div className="flex gap-4 text-xs font-mono text-[var(--text-muted)] mt-2">
          <span>{post.date}</span>
          <span>{post.read_time}</span>
        </div>
      </div>
      <div className="text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-line">
        {post.content}
      </div>
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[var(--border-glass)]">
          {post.tags.map(t => <span key={t} className="tag text-[10px]">#{t}</span>)}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════ */
export default function Home() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [adminOpen, setAdminOpen]       = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [toast, setToast]               = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  };

  /* Keyboard shortcuts */
  useEffect(() => {
    const handler = (e) => {
      if (e.altKey && e.key.toLowerCase() === 't') setTerminalOpen(prev => !prev);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleOpenResume     = () => setModalContent({ type: 'resume' });
  const handleOpenCaseStudy  = (p) => setModalContent({ type: 'project', data: p });
  const handleOpenCertModal  = (c) => setModalContent({ type: 'cert',    data: c });
  const handleOpenArticle    = (a) => setModalContent({ type: 'blog',    data: a });

  const handleOpenAdmin = () => {
    if (typeof window === 'undefined') return;
    const pass = window.prompt('Enter Admin Password:');
    if (pass === 'admin' || pass === 'ammar2026') {
      setAdminOpen(true);
    } else if (pass !== null) {
      showToast('Access denied. Incorrect password.', 'error');
    }
  };

  return (
    <main className="min-h-screen relative bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Skip to main content (accessibility) */}
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999]
          focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[var(--accent-cyan)] focus:text-slate-900 focus:font-bold"
      >
        Skip to main content
      </a>

      {/* Background canvas */}
      <ParticlesBg />

      {/* Navigation */}
      <Navbar onOpenTerminal={() => setTerminalOpen(true)} />

      {/* ── Sections ── */}
      <Hero onOpenResume={handleOpenResume} />
      <About />
      <Skills />
      <Services />
      <Projects onOpenCaseStudy={handleOpenCaseStudy} />
      <Certificates onOpenCertModal={handleOpenCertModal} />
      <Timeline />
      <GitHubShowcase />
      <BlogSection onOpenArticle={handleOpenArticle} />
      <ContactSection onShowToast={showToast} />
      <Footer onOpenAdmin={handleOpenAdmin} />

      {/* ── Floating widgets ── */}
      <AIAssistant />

      {/* ── Modals ── */}
      <TerminalModal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />
      <AdminModal    isOpen={adminOpen}    onClose={() => setAdminOpen(false)} onShowToast={showToast} />

      <GlobalModal isOpen={!!modalContent} onClose={() => setModalContent(null)}>
        {modalContent?.type === 'resume'  && <ResumeModal />}
        {modalContent?.type === 'project' && <ProjectModal project={modalContent.data} />}
        {modalContent?.type === 'cert'    && <CertModal    cert={modalContent.data}    />}
        {modalContent?.type === 'blog'    && <ArticleModal post={modalContent.data}    />}
      </GlobalModal>

      {/* ── Toast ── */}
      <Toast toast={toast} />
    </main>
  );
}
