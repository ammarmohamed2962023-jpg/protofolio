/* eslint-disable @next/next/no-img-element */
'use client';
import { useState } from 'react';
import Breadcrumbs from './Breadcrumbs';
import { Search, Bell, Sun, Moon, LogOut, User, Shield, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminNavbar({ user, onOpenPalette, onLogout }) {
  const [theme, setTheme] = useState('dark');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <header className="h-16 px-6 glass-card border-b border-[var(--border-glass)] flex items-center justify-between sticky top-0 z-30">
      {/* Left: Breadcrumbs */}
      <Breadcrumbs />

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Command Palette Trigger */}
        <button
          onClick={onOpenPalette}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-sm text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all border border-[var(--border-glass)]"
        >
          <Search className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
          <span className="hidden sm:inline">Search commands...</span>
          <kbd className="px-1.5 py-0.5 rounded glass-sm font-mono text-[9px] text-[var(--text-secondary)]">⌘K</kbd>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl glass-sm text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] transition-colors"
          title="Toggle Dark/Light Mode"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl glass-sm text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--accent-cyan)] shadow-[var(--glow-cyan)] animate-pulse" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-80 glass-card border border-[var(--border-glass)] rounded-2xl shadow-2xl p-4 space-y-3 z-50"
              >
                <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-2">
                  <span className="text-xs font-bold text-[var(--text-primary)]">System Notifications</span>
                  <span className="text-[10px] tag font-mono">3 New</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl glass-sm space-y-1">
                    <div className="flex items-center justify-between font-semibold text-[var(--text-primary)]">
                      <span className="flex items-center gap-1.5 text-[var(--accent-cyan)]">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Prisma DB Online
                      </span>
                      <span className="text-[9px] text-[var(--text-muted)] font-mono">2m ago</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)]">PostgreSQL database schema synchronized cleanly.</p>
                  </div>
                  <div className="p-2.5 rounded-xl glass-sm space-y-1">
                    <div className="flex items-center justify-between font-semibold text-[var(--text-primary)]">
                      <span className="flex items-center gap-1.5 text-[var(--accent-green)]">
                        <Shield className="w-3.5 h-3.5" />
                        JWT Session Active
                      </span>
                      <span className="text-[9px] text-[var(--text-muted)] font-mono">1h ago</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)]">RBAC session established for {user?.name || 'Admin'}.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl glass-sm hover:border-[var(--accent-cyan)]/50 transition-colors"
          >
            <img
              src={user?.avatar || 'https://github.com/ammarmohamed2962023-jpg.png'}
              alt={user?.name || 'User'}
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-[var(--accent-cyan)]/40"
            />
            <span className="text-xs font-bold text-[var(--text-primary)] hidden md:inline">{user?.name?.split(' ')[0] || 'Admin'}</span>
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-56 glass-card border border-[var(--border-glass)] rounded-2xl shadow-2xl p-2 space-y-1 z-50"
              >
                <div className="px-3 py-2 border-b border-[var(--border-glass)]">
                  <p className="text-xs font-bold text-[var(--text-primary)] truncate">{user?.name || 'Admin User'}</p>
                  <p className="text-[10px] text-[var(--text-muted)] font-mono truncate">{user?.email || 'admin@ammar.dev'}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
