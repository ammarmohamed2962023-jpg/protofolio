/* eslint-disable @next/next/no-img-element */
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Settings, Users, ShieldAlert, Activity, FileText, Bell, LogOut, ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const NAVIGATION = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Settings', href: '/admin/settings', icon: Settings, role: 'ADMIN' },
  { name: 'Users', href: '/admin/users', icon: Users, role: 'ADMIN' },
  { name: 'Roles & Access', href: '/admin/roles', icon: ShieldAlert, role: 'ADMIN' },
  { name: 'Activity & Audit', href: '/admin/logs', icon: Activity },
  { name: 'Notifications', href: '/admin/notifications', icon: Bell, badge: '3' },
];

export default function AdminSidebar({ user, isCollapsed, onToggleCollapse, onLogout }) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 flex flex-col glass-card border-r border-[var(--border-glass)] transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[var(--border-glass)]">
        <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--accent-cyan)] to-[var(--accent-purple)] flex items-center justify-center font-black text-slate-950 text-sm shadow-[var(--glow-cyan)] shrink-0">
            EP
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-sm text-[var(--text-primary)] leading-tight tracking-tight">
                Enterprise CMS
              </span>
              <span className="text-[10px] text-[var(--accent-cyan)] font-mono font-semibold">v2.0 Phase 1</span>
            </div>
          )}
        </Link>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg glass-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* User Mini Profile */}
      <div className="p-3 border-b border-[var(--border-glass)]">
        <div className="flex items-center gap-3 p-2 rounded-xl glass-sm">
          <img
            src={user?.avatar || 'https://github.com/ammarmohamed2962023-jpg.png'}
            alt={user?.name || 'Admin'}
            className="w-8 h-8 rounded-lg object-cover ring-2 ring-[var(--accent-cyan)]/30 shrink-0"
          />
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[var(--text-primary)] truncate">{user?.name || 'Ammar Admin'}</span>
              <div className="flex items-center gap-1 text-[9px] font-mono text-[var(--accent-cyan)]">
                <Shield className="w-2.5 h-2.5" />
                <span>{user?.role || 'ADMIN'}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {NAVIGATION.map((item) => {
          if (item.role && user?.role !== item.role) return null;

          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'text-slate-950 font-bold bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-blue)] shadow-[var(--glow-cyan)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
              }`}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-[var(--accent-cyan)]'}`} />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
              {!isCollapsed && item.badge && (
                <span className="ml-auto px-2 py-0.5 rounded-full text-[9px] font-bold bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/40">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Logout Button */}
      <div className="p-3 border-t border-[var(--border-glass)]">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
