'use client';
import { useState, useEffect } from 'react';
import { Shield, Activity, Users, Database, Server, CheckCircle2, RefreshCw, Key, Lock, ArrowUpRight, Zap, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import AdminEmptyState from '@/components/admin/AdminEmptyState';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    userCount: 2,
    roleCount: 2,
    activeSessions: 1,
    dbStatus: 'Connected (PostgreSQL)',
    resendStatus: 'Active',
    gmailStatus: 'Active',
  });
  const [loading, setLoading] = useState(false);

  const refreshDashboard = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 glass-card border border-[var(--border-glass)] rounded-3xl relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="section-badge text-[10px]">CMS Phase 1 Infrastructure</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/40 font-mono">
              RBAC Enabled
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
            Enterprise Admin <span className="gradient-text">Dashboard Shell</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] max-w-xl">
            Normalized Prisma database architecture, Auth.js/JWT session handler, protected route guards, and infrastructure settings.
          </p>
        </div>

        <button
          onClick={refreshDashboard}
          disabled={loading}
          className="btn-primary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 z-10 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh System</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Database Engine</span>
            <div className="p-2 rounded-xl glass-sm text-[var(--accent-cyan)]">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg font-black text-[var(--text-primary)]">PostgreSQL</div>
            <p className="text-[10px] text-[var(--accent-cyan)] font-mono flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3" />
              Prisma ORM Schema Valid
            </p>
          </div>
        </motion.div>

        {/* Metric 2 */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Auth & Session Guard</span>
            <div className="p-2 rounded-xl glass-sm text-[var(--accent-purple)]">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg font-black text-[var(--text-primary)]">JWT + Jose</div>
            <p className="text-[10px] text-[var(--accent-purple)] font-mono flex items-center gap-1 mt-0.5">
              <Key className="w-3 h-3" />
              HTTP-Only Cookie Protected
            </p>
          </div>
        </motion.div>

        {/* Metric 3 */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Active Services</span>
            <div className="p-2 rounded-xl glass-sm text-[var(--accent-green)]">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg font-black text-[var(--text-primary)]">Dual Email Gateway</div>
            <p className="text-[10px] text-[var(--accent-green)] font-mono flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3" />
              Resend + Gmail Active
            </p>
          </div>
        </motion.div>

        {/* Metric 4 */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Route Guard Middleware</span>
            <div className="p-2 rounded-xl glass-sm text-[var(--accent-blue)]">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg font-black text-[var(--text-primary)]">Protected /admin/*</div>
            <p className="text-[10px] text-[var(--accent-blue)] font-mono flex items-center gap-1 mt-0.5">
              <Server className="w-3 h-3" />
              RBAC Strict Checking
            </p>
          </div>
        </motion.div>
      </div>

      {/* Two Column Layout: Activity Logs Feed & Quick Infrastructure Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): System Activity Feed */}
        <div className="lg:col-span-2 glass-card space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[var(--accent-cyan)]" />
              <h2 className="text-sm font-bold text-[var(--text-primary)]">System Activity & Audit Logs</h2>
            </div>
            <span className="text-[10px] tag font-mono">Live Feed</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl glass-sm flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[var(--text-primary)]">Prisma Database Models Created</span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">Just now</span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Normalized schema created with User, Role, Permission, Setting, Session, ActivityLog, AuditLog, Notification models.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl glass-sm flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[var(--accent-purple)]/10 text-[var(--accent-purple)] shrink-0 mt-0.5">
                <Shield className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[var(--text-primary)]">Middleware Route Protection Active</span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">5m ago</span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Middleware guard active on all /admin routes with HTTP-Only cookie verification and RBAC roles.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl glass-sm flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[var(--accent-green)]/10 text-[var(--accent-green)] shrink-0 mt-0.5">
                <Zap className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[var(--text-primary)]">Dual Email Gateway Synchronized</span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">10m ago</span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Contact API successfully delivering messages to ammar.mohamed2962023@gmail.com via Resend & Gmail.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 col): System Infrastructure Summary */}
        <div className="glass-card space-y-4">
          <div className="border-b border-[var(--border-glass)] pb-3">
            <h2 className="text-sm font-bold text-[var(--text-primary)]">Phase 1 Infrastructure</h2>
            <p className="text-[11px] text-[var(--text-muted)]">Core framework modules</p>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl glass-sm">
              <span className="font-semibold text-[var(--text-secondary)]">PostgreSQL Schema</span>
              <span className="font-mono text-[10px] text-[var(--accent-cyan)] font-bold">Configured</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl glass-sm">
              <span className="font-semibold text-[var(--text-secondary)]">Prisma ORM</span>
              <span className="font-mono text-[10px] text-[var(--accent-green)] font-bold">v7 Client</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl glass-sm">
              <span className="font-semibold text-[var(--text-secondary)]">JWT / Jose Auth</span>
              <span className="font-mono text-[10px] text-[var(--accent-purple)] font-bold">Active</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl glass-sm">
              <span className="font-semibold text-[var(--text-secondary)]">RBAC Guard</span>
              <span className="font-mono text-[10px] text-[var(--accent-blue)] font-bold">ADMIN / EDITOR</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl glass-sm">
              <span className="font-semibold text-[var(--text-secondary)]">Command Palette</span>
              <span className="font-mono text-[10px] text-[var(--accent-cyan)] font-bold">⌘K Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
