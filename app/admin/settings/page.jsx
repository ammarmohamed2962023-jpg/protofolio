'use client';
import { useState, useEffect } from 'react';
import { Settings, Shield, Globe, Lock, Bell, CheckCircle2, RefreshCw } from 'lucide-react';
import { StatCardSkeleton } from '@/components/admin/AdminSkeletons';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data.success) {
          setSettings(data.settings);
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 glass-card border border-[var(--border-glass)] rounded-3xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="section-badge text-[10px]">Infrastructure Only</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--accent-purple)]/20 text-[var(--accent-purple)] border border-[var(--accent-purple)]/40 font-mono">
              Role: ADMIN Required
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
            System <span className="gradient-text">Settings Infrastructure</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] max-w-xl">
            Phase 1 core settings store architecture backed by Prisma Setting model.
          </p>
        </div>
      </div>

      {/* Settings Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {settings.map((item) => (
            <div key={item.key} className="glass-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--accent-cyan)] font-mono">{item.key}</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold tag uppercase">{item.group}</span>
              </div>
              <div className="p-3 rounded-xl glass-sm text-xs font-mono text-[var(--text-primary)] break-all">
                {typeof item.value === 'object' ? JSON.stringify(item.value) : String(item.value)}
              </div>
              <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                <span>Public: {item.isPublic ? 'Yes' : 'No'}</span>
                <span className="text-[var(--accent-green)] flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  Prisma Setting Model Synchronized
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
