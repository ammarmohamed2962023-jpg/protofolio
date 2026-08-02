'use client';
import { useState, useEffect, useRef } from 'react';
import { X, Terminal as TermIcon } from 'lucide-react';

const ASCII_BANNER = `
  ___   __  __  __  __    _   ___
 / _ | /  |/  ||  |/  /  /_\\ | _ \\
/ __ |/ /|  / ||    <  / _ \\|   /
/_/ |_/_/ |_/|_||_|\\__\\/_/ \\_|_|_\\

  Portfolio CLI v3.1  |  Alt+T to open
  Type 'help' to see all commands.
`;

const COMMANDS = {
  help: () => ({
    output: `Available commands:
  about       — Who is Ammar Mohamed
  skills      — Technical skills overview
  projects    — List of projects
  experience  — Academic experience
  education   — University details
  certifications — Cisco credentials
  resume      — How to view/download CV
  blog        — Knowledge hub articles
  github      — GitHub profile info
  contact     — Contact details
  theme       — Current theme info
  language    — Current language info
  clear       — Clear the terminal
  help        — Show this help menu`,
    color: 'text-[var(--accent-cyan)]',
  }),

  about: () => ({
    output: `Ammar Mohamed
──────────────────────────────
  Role       : CS Student & Software Developer
  University : Innovation University
  Faculty    : Computers & Information
  Status     : Open for Internship 🟢
  Email      : ammar.mohamed.cs@gmail.com
  Interests  : Networking · Software Dev · AI`,
    color: 'text-[var(--accent-green)]',
  }),

  skills: () => ({
    output: `Technical Skills
──────────────────────────────
  [████████░░] C# .NET    90%
  [████████░░] Java OOP   88%
  [████████░░] TCP/IP     93%
  [█████████░] Subnetting 95%
  [████████░░] HTML/CSS   92%
  [████████░░] JavaScript 84%
  [████████░░] SQL Server 85%
  [█████████░] Git/GitHub 88%`,
    color: 'text-[var(--accent-blue)]',
  }),

  projects: () => ({
    output: `Projects Portfolio
──────────────────────────────
  1. ALASAR Pharmacy System
     → C# | SQL Server | WinForms | RDLC
     → Complete POS, barcode, billing system

  2. Student Management System
     → Java OOP | MySQL | JavaFX
     → Enrollment, GPA, grade tracking

  3. Cisco Network Lab
     → Packet Tracer | OSPF | VLAN | ACL
     → Enterprise topology simulation

  4. Portfolio v3.1
     → Next.js | Tailwind | JavaScript
     → This website you're viewing now!`,
    color: 'text-[var(--accent-purple)]',
  }),

  education: () => ({
    output: `Education
──────────────────────────────
  Degree     : Bachelor of Computer Science
  University : Innovation University
  Faculty    : Faculty of Computers & Information
  Expected   : 2027
  Focus      : Networking · Software Eng · AI`,
    color: 'text-[var(--accent-cyan)]',
  }),

  experience: () => ({
    output: `Academic Experience
──────────────────────────────
  2023 — Started CS at Innovation University
  2024 — Built ALASAR Pharmacy System (C#)
  2024 — Earned Cisco Networking Certificates
  2024 — Built Student Management System (Java)
  2025 — Launched Portfolio v3.1 (Next.js)
  2025 — Pursuing CCNA & internship`,
    color: 'text-[var(--accent-orange)]',
  }),

  certifications: () => ({
    output: `Cisco Certifications (Netacad)
──────────────────────────────
  ✓ Cisco Networking Academy Certificate
  ✓ English for IT (OpenEDG / Cisco)
  ✓ Networking Basics
  ✓ Network Addressing & Troubleshooting

  All verified on Cisco Netacad Platform.`,
    color: 'text-[var(--accent-green)]',
  }),

  resume: () => ({
    output: `Resume / CV
──────────────────────────────
  • Click "Download CV" in the Hero section
  • Click "Resume" in the Navbar
  • Use "Preview Resume" for online view
  • PDF path: /assets/cv/cv_ammar_mohamed.pdf`,
    color: 'text-[var(--accent-blue)]',
  }),

  blog: () => ({
    output: `Knowledge Hub Articles
──────────────────────────────
  Topics covered:
  • Cisco OSPF Routing Protocol deep-dive
  • C# WinForms enterprise architecture
  • Building TCP/IP Network Labs
  → Scroll to the Blog section to read all.`,
    color: 'text-[var(--accent-purple)]',
  }),

  github: () => ({
    output: `GitHub Profile
──────────────────────────────
  URL  : github.com/ammar-mohamed
  Focus: C# apps, Java OOP, Web projects
  → Scroll to the GitHub section to explore.`,
    color: 'text-white',
  }),

  contact: () => ({
    output: `Contact Information
──────────────────────────────
  Email    : ammar.mohamed.cs@gmail.com
  LinkedIn : linkedin.com/in/ammar-mohamed
  GitHub   : github.com/ammar-mohamed
  Status   : Open for Internship 🟢

  Use the Contact form to send a message!`,
    color: 'text-[var(--accent-cyan)]',
  }),

  theme: () => ({
    output: `Current theme: ${typeof window !== 'undefined' ? document.documentElement.getAttribute('data-theme') || 'dark' : 'dark'}
  Toggle: Click the sun/moon icon in Navbar.`,
    color: 'text-[var(--accent-orange)]',
  }),

  language: () => ({
    output: `Current language: ${typeof window !== 'undefined' ? document.documentElement.getAttribute('lang') || 'en' : 'en'}
  Toggle: Click the globe icon in Navbar.`,
    color: 'text-[var(--accent-blue)]',
  }),
};

export default function TerminalModal({ isOpen, onClose }) {
  const [history, setHistory]   = useState([{ type: 'banner', text: ASCII_BANNER }]);
  const [input, setInput]       = useState('');
  const [cmdHistory, setCmdHist] = useState([]);
  const [histIdx, setHistIdx]   = useState(-1);
  const endRef                  = useRef(null);
  const inputRef                = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history]);
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 100); }, [isOpen]);

  /* Alt+T shortcut */
  useEffect(() => {
    const handler = (e) => { if (e.altKey && e.key.toLowerCase() === 't') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const runCommand = () => {
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...history, { type: 'input', text: cmd }];
    setCmdHist(prev => [cmd, ...prev]);
    setHistIdx(-1);
    setInput('');

    if (cmd === 'clear') { setHistory([{ type: 'banner', text: ASCII_BANNER }]); return; }

    const handler = COMMANDS[cmd];
    if (handler) {
      const result = handler();
      setHistory([...newHistory, { type: 'output', text: result.output, color: result.color }]);
    } else {
      setHistory([...newHistory, {
        type: 'output',
        text: `Command not found: '${cmd}'\nType 'help' to see all available commands.`,
        color: 'text-red-400',
      }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { runCommand(); return; }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(histIdx + 1, cmdHistory.length - 1);
      setHistIdx(next);
      setInput(cmdHistory[next] || '');
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? '' : cmdHistory[next]);
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const match = Object.keys(COMMANDS).find(k => k.startsWith(input.toLowerCase()));
      if (match) setInput(match);
    }
    if (e.key === 'Escape') onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay no-print" onClick={onClose} role="dialog" aria-modal="true" aria-label="Terminal">
      <div
        className="w-full max-w-2xl max-h-[85dvh] flex flex-col rounded-2xl overflow-hidden
          border border-[var(--border-glass-hover)] shadow-[var(--shadow-lg)]"
        style={{ background: '#0d1117' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border-glass)]"
          style={{ background: '#161b27' }}
        >
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="flex items-center gap-2 text-xs font-bold text-[var(--accent-cyan)]">
              <TermIcon className="w-3.5 h-3.5" aria-hidden="true" />
              Ammar's Portfolio CLI
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-[var(--text-muted)] hover:text-white transition-colors"
            aria-label="Close terminal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Output */}
        <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1" style={{ background: '#060912' }}>
          {history.map((line, i) => (
            <div key={i}>
              {line.type === 'banner' && (
                <pre className="text-[var(--accent-cyan)] text-[9px] leading-tight opacity-70 mb-2 whitespace-pre">
                  {line.text}
                </pre>
              )}
              {line.type === 'input' && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[var(--accent-green)] shrink-0">ammar@portfolio</span>
                  <span className="text-[var(--text-muted)]">:~$</span>
                  <span className="text-white">{line.text}</span>
                </div>
              )}
              {line.type === 'output' && (
                <pre className={`whitespace-pre-wrap leading-relaxed mt-1 mb-2 ${line.color || 'text-[var(--text-secondary)]'}`}>
                  {line.text}
                </pre>
              )}
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Input row */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-t border-[var(--border-glass)]"
          style={{ background: '#0d1117' }}
        >
          <span className="text-[var(--accent-green)] text-xs font-mono shrink-0">ammar@portfolio:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-white text-xs font-mono outline-none caret-[var(--accent-cyan)]"
            placeholder="Type a command… (Tab to autocomplete, ↑↓ for history)"
            spellCheck={false}
            aria-label="Terminal input"
          />
        </div>
      </div>
    </div>
  );
}
