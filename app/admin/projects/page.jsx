'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProjectDataTable from '@/components/admin/projects/ProjectDataTable';
import { Plus, FolderKanban, Star, Pin, CheckCircle2, FileText, Archive } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, totalPages: 1, total: 0 });
  const [metrics, setMetrics] = useState({ total: 0, published: 0, draft: 0, featured: 0, archived: 0, pinned: 0 });
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [featured, setFeatured] = useState('');
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function getProjects() {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          page: String(page),
          limit: '10',
          search,
          status,
          featured,
        });

        const res = await fetch(`/api/admin/projects?${query}`);
        const data = await res.json();

        if (isMounted && data.success) {
          setProjects(data.data || []);
          setMeta(data.meta || {});
          if (data.meta?.metrics) {
            setMetrics(data.meta.metrics);
          }
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    getProjects();
    return () => {
      isMounted = false;
    };
  }, [page, search, status, featured, refreshKey]);

  const handleBulkAction = async (action, ids) => {
    try {
      await fetch('/api/admin/projects/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'bulk', ids: { action, ids } }),
      });
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error('Bulk action error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to soft delete this project?')) return;
    try {
      await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await fetch(`/api/admin/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'duplicate' }),
      });
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error('Duplicate error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 glass-card border border-[var(--border-glass)] rounded-3xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="section-badge text-[10px]">CMS Phase 2A</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/40 font-mono">
              PostgreSQL Connected
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
            Projects <span className="gradient-text">Management System</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] max-w-xl">
            Enterprise CRUD pipeline, version history, multi-platform SEO previews, bulk operations, and media storage integration.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="btn-primary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-[var(--glow-cyan)] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Project</span>
        </Link>
      </div>

      {/* Executive Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        <div className="glass-card space-y-1 p-4">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span>Total Projects</span>
            <FolderKanban className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
          </div>
          <div className="text-xl font-black text-[var(--text-primary)]">{metrics.total}</div>
        </div>

        <div className="glass-card space-y-1 p-4">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span>Published</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400">{metrics.published}</div>
        </div>

        <div className="glass-card space-y-1 p-4">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span>Drafts</span>
            <FileText className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-xl font-black text-[var(--text-primary)]">{metrics.draft}</div>
        </div>

        <div className="glass-card space-y-1 p-4">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span>Featured</span>
            <Star className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400">{metrics.featured}</div>
        </div>

        <div className="glass-card space-y-1 p-4">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span>Pinned</span>
            <Pin className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
          </div>
          <div className="text-xl font-black text-[var(--accent-cyan)]">{metrics.pinned}</div>
        </div>

        <div className="glass-card space-y-1 p-4">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span>Archived</span>
            <Archive className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-black text-[var(--text-muted)]">{metrics.archived}</div>
        </div>
      </div>

      {/* Main Data Table */}
      <ProjectDataTable
        projects={projects}
        meta={meta}
        metrics={metrics}
        onSearch={setSearch}
        onFilterStatus={setStatus}
        onFilterFeatured={setFeatured}
        onPageChange={setPage}
        onBulkAction={handleBulkAction}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
      />
    </div>
  );
}
