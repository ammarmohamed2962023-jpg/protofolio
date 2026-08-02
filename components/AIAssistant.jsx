'use client';
import { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Minimize2, Maximize2, Sparkles } from 'lucide-react';

/* ── Knowledge base ── */
const KB = [
  {
    patterns: ['project', 'alasar', 'pharmacy', 'system'],
    reply: "Ammar's flagship project is the **ALASAR Pharmacy Management System** — a full C# desktop application with SQL Server, POS billing, barcode scanning, and RDLC reports. He also built a **Student Management System** in Java OOP with MySQL, and a **Cisco Network Lab** with OSPF, VLANs, and ACL rules.",
  },
  {
    patterns: ['certif', 'cisco', 'credential', 'netacad'],
    reply: "Ammar holds **4 Cisco Networking Academy certifications**: Cisco Networking Academy Certificate, English for IT (OpenEDG), Networking Basics, and Network Addressing & Troubleshooting. All are verified on Cisco's Netacad platform.",
  },
  {
    patterns: ['skill', 'language', 'programming', 'tech'],
    reply: "Ammar's core skills include:\n• **C#** (.NET WinForms, 90%)\n• **Java** (OOP & Swing, 88%)\n• **C++** (Data Structures, 82%)\n• **JavaScript / Next.js** (84%)\n• **Cisco IOS** (Routing, VLAN, ACL, 90%+)\n• **SQL Server & MySQL** (85%)",
  },
  {
    patterns: ['intern', 'job', 'hire', 'recruit', 'available', 'work'],
    reply: "🟢 **Ammar is actively open for internship opportunities!** He's looking for software engineering or networking positions where he can contribute to real products. Reach him at ammar.mohamed.cs@gmail.com or via LinkedIn.",
  },
  {
    patterns: ['education', 'university', 'study', 'degree', 'faculty'],
    reply: "Ammar is studying **Computer Science** at **Innovation University**, Faculty of Computers and Information. He's specializing in Networking, Software Development, and AI — expected graduation: 2027.",
  },
  {
    patterns: ['goal', 'future', 'career', 'ambition', 'plan'],
    reply: "Ammar's career goal is to become a professional **Software Engineer** specializing in backend systems, cloud computing, and AI-driven networking. Short-term: land a quality internship. Mid-term: contribute to scalable backend or cloud infrastructure projects.",
  },
  {
    patterns: ['resume', 'cv', 'download'],
    reply: "You can **download Ammar's CV** using the 'Download CV' button in the hero section or the Resume button in the navbar. The PDF includes his education, skills, projects, and Cisco certifications.",
  },
  {
    patterns: ['blog', 'article', 'write', 'post'],
    reply: "Ammar writes technical articles in the **Knowledge Hub** section — covering networking concepts, C# development tips, and AI fundamentals. Click the Blog section to explore his latest posts.",
  },
  {
    patterns: ['contact', 'email', 'reach', 'message', 'linkedin', 'whatsapp', 'phone'],
    reply: "You can contact Ammar via:\n• **WhatsApp / Phone:** 01091698261 (wa.me/201091698261)\n• **Email:** ammar.mohamed.cs@gmail.com\n• **LinkedIn:** linkedin.com/in/ammar-mohammed-mohamed-48b415386/\n• **Contact form** at the bottom of this page\n\nHe typically replies within 24 hours.",
  },
  {
    patterns: ['networking', 'network', 'cisco', 'ospf', 'vlan', 'tcp'],
    reply: "Ammar is deeply knowledgeable in networking — from **TCP/IP & OSI fundamentals** to hands-on **Cisco router/switch configuration**. He's proficient in OSPF, RIP, VLAN design, ACL firewall rules, and IPv4/IPv6 subnetting with 95%+ confidence on subnetting.",
  },
  {
    patterns: ['ai', 'machine learning', 'python', 'artificial intelligence'],
    reply: "Ammar is actively learning AI and ML using **Python, Scikit-Learn, and OpenCV**. He's built prototype AI features including basic image processing and ML classification models. AI is one of his core future-focus areas.",
  },
  {
    patterns: ['interview', 'question', 'prepare'],
    reply: "Ammar is well-prepared for technical interviews covering:\n• OOP principles & design patterns (C# / Java)\n• Network protocols & OSI model\n• SQL queries & database design\n• Data structures & algorithms (C++)\n• Web fundamentals (HTML, CSS, JS)\n\nHe's actively practicing on LeetCode.",
  },
];

const SUGGESTIONS = [
  "What projects has Ammar built?",
  "Is Ammar open for internship?",
  "What are Ammar's main skills?",
  "What certifications does he have?",
  "How can I contact Ammar?",
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2" aria-label="Assistant is typing">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

function parseReply(text) {
  return text.split('\n').map((line, i) => (
    <span key={i} className="block">
      {line.split(/\*\*(.+?)\*\*/g).map((part, j) =>
        j % 2 === 1
          ? <strong key={j} className="text-[var(--accent-cyan)] font-bold">{part}</strong>
          : part
      )}
    </span>
  ));
}

export default function AIAssistant() {
  const [open, setOpen]       = useState(false);
  const [minimized, setMin]   = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hi! 👋 I'm Ammar's AI Assistant. Ask me anything about his projects, skills, certifications, or career." },
  ]);
  const [input, setInput]     = useState('');
  const [typing, setTyping]   = useState(false);
  const [showSug, setShowSug] = useState(true);
  const chatEndRef            = useRef(null);
  const inputRef              = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  /* Keyboard shortcut: Alt+A */
  useEffect(() => {
    const handler = (e) => {
      if (e.altKey && e.key.toLowerCase() === 'a') {
        setOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const getReply = (query) => {
    const q = query.toLowerCase();
    for (const { patterns, reply } of KB) {
      if (patterns.some(p => q.includes(p))) return reply;
    }
    return "I can answer questions about Ammar's **projects, skills, certifications, career goals, education, and contact details**. Try asking one of those topics!";
  };

  const handleSend = (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setMessages(prev => [...prev, { sender: 'user', text: msg }]);
    setInput('');
    setShowSug(false);
    setTyping(true);

    setTimeout(() => {
      const reply = getReply(msg);
      setTyping(false);
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 700 + Math.random() * 400);
  };

  const handleSuggestion = (s) => {
    handleSend(s);
    inputRef.current?.focus();
  };

  if (!open) {
    return (
      <button
        onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 300); }}
        className="fixed bottom-6 left-6 w-14 h-14 rounded-full text-white flex items-center justify-center z-50
          shadow-[var(--glow-strong)] hover:scale-110 transition-all animate-glow-pulse no-print"
        style={{ background: 'var(--gradient-primary)' }}
        aria-label="Open AI Assistant (Alt+A)"
        title="AI Assistant (Alt+A)"
      >
        <Bot className="w-6 h-6" aria-hidden="true" />
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-6 left-6 z-50 no-print"
      role="dialog"
      aria-label="AI Assistant"
      aria-modal="true"
    >
      {/* Chat window */}
      <div
        className={`w-80 sm:w-96 bg-[var(--bg-secondary)] border border-[var(--border-glass-hover)] rounded-2xl
          shadow-[var(--shadow-lg)] flex flex-col overflow-hidden transition-all duration-300
          ${minimized ? 'h-14' : 'h-[480px]'}`}
      >
        {/* Header */}
        <div className="p-3 flex items-center justify-between border-b border-[var(--border-glass)] shrink-0"
          style={{ background: 'var(--bg-card)' }}
        >
          <span className="flex items-center gap-2 text-sm font-bold text-[var(--accent-cyan)]">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            Ammar's AI Assistant
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setMin(m => !m)}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              aria-label={minimized ? 'Maximize chat' : 'Minimize chat'}
            >
              {minimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Close AI Assistant"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {!minimized && (
          <>
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 scroll-smooth">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`max-w-[88%] px-3 py-2.5 rounded-xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[var(--accent-blue)] text-white ml-auto text-right rounded-br-sm'
                      : 'bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/20 text-[var(--text-primary)] mr-auto rounded-bl-sm'
                  }`}
                  aria-label={m.sender === 'user' ? 'Your message' : "Assistant's reply"}
                >
                  {m.sender === 'bot' ? parseReply(m.text) : m.text}
                </div>
              ))}

              {typing && (
                <div className="max-w-[88%] bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/20 rounded-xl rounded-bl-sm mr-auto">
                  <TypingDots />
                </div>
              )}

              {/* Suggestion chips */}
              {showSug && messages.length <= 1 && (
                <div className="space-y-1.5 pt-1">
                  <p className="text-[9px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">Suggested questions</p>
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => handleSuggestion(s)}
                      className="block w-full text-left px-3 py-1.5 rounded-lg text-[10px] glass-sm
                        text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] hover:border-[var(--accent-cyan)] transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-[var(--border-glass)] flex gap-2 shrink-0">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about Ammar…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="flex-1 px-3 py-2 text-xs form-input rounded-full"
                aria-label="Type your question"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || typing}
                className="p-2 rounded-full bg-[var(--accent-cyan)] text-slate-900 hover:scale-105 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
