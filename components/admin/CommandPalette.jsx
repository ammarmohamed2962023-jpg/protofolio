'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, LayoutDashboard, Settings, User, Bell, Shield, FileText, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COMMANDS = [
  { id: 'dashboard', name: 'Dashboard Overview', icon: LayoutDashboard, href: '/admin' },
  { id: 'settings', name: 'System Settings', icon: Settings, href: '/admin/settings' },
  { id: 'users', name: 'User Management', icon: User, href: '/admin/users' },
  { id: 'roles', name: 'Roles & Permissions', icon: Shield, href: '/admin/roles' },
  { id: 'notifications', name: 'Notifications Center', icon: Bell, href: '/admin/notifications' },
  { id: 'activity', name: 'Activity & Audit Logs', icon: FileText, href: '/admin/logs' },
];

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filtered = COMMANDS.filter((cmd) =>
    cmd.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href) => {
    onClose();
    router.push(href);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="w-full max-w-xl glass-card border border-[var(--border-glass)] overflow-hidden shadow-2xl rounded-2xl"
        >
          {/* Header Input */}
          <div className="relative flex items-center px-4 border-b border-[var(--border-glass)]">
            <Search className="w-4 h-4 text-[var(--accent-cyan)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search section (e.g. settings)..."
              className="w-full py-4 pl-3 pr-8 bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
              autoFocus
            />
            <button onClick={onClose} className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-xs text-[var(--text-muted)]">No commands found matching &quot;{query}&quot;</div>
            ) : (
              filtered.map((cmd) => {
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => handleSelect(cmd.href)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[var(--accent-cyan)]/10 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg glass-sm text-[var(--accent-cyan)] group-hover:scale-105 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-[var(--text-primary)]">{cmd.name}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--accent-cyan)] group-hover:translate-x-1 transition-all" />
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="px-4 py-2.5 bg-[var(--bg-secondary)]/50 border-t border-[var(--border-glass)] flex items-center justify-between text-[10px] text-[var(--text-muted)]">
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 rounded glass-sm font-mono text-[9px]">ESC</kbd> to close
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 rounded glass-sm font-mono text-[9px]">⌘ K</kbd> toggle palette
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
