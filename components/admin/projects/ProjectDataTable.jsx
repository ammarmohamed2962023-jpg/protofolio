/* eslint-disable @next/next/no-img-element */
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Star, Pin, Edit3, Eye, Copy, Trash2, RotateCcw, ChevronLeft, ChevronRight, CheckSquare, Square, MoreHorizontal, ShieldCheck } from 'lucide-react';

export default function ProjectDataTable({
  projects = [],
  meta = {},
  metrics = {},
  onSearch,
  onFilterStatus,
  onFilterFeatured,
  onPageChange,
  onBulkAction,
  onDelete,
  onDuplicate,
}) {
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelectAll = () => {
    if (selectedIds.length === projects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(projects.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulk = (action) => {
    if (selectedIds.length === 0) return;
    onBulkAction(action, selectedIds);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-4">
      {/* Controls & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 glass-card p-4 rounded-2xl">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="search"
            placeholder="Search projects by title, summary, client..."
            onChange={(e) => onSearch(e.target.value)}
            className="form-input pl-10 text-xs rounded-xl"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            onChange={(e) => onFilterStatus(e.target.value)}
            className="form-input text-xs py-2 px-3 rounded-xl w-32"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="APPROVED">Approved</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <select
            onChange={(e) => onFilterFeatured(e.target.value)}
            className="form-input text-xs py-2 px-3 rounded-xl w-32"
          >
            <option value="">All Projects</option>
            <option value="true">Featured Only</option>
            <option value="false">Standard Only</option>
          </select>
        </div>
      </div>

      {/* Bulk Action Bar (Visible when items selected) */}
      {selectedIds.length > 0 && (
        <div className="p-3 glass-card border border-[var(--accent-cyan)]/40 rounded-xl flex items-center justify-between text-xs animate-fade-in">
          <span className="font-bold text-[var(--accent-cyan)]">
            {selectedIds.length} projects selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulk('publish')}
              className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold hover:bg-emerald-500/30"
            >
              Publish Selected
            </button>
            <button
              onClick={() => handleBulk('archive')}
              className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 font-bold hover:bg-amber-500/30"
            >
              Archive Selected
            </button>
            <button
              onClick={() => handleBulk('softDelete')}
              className="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-400 font-bold hover:bg-rose-500/30"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="glass-card overflow-hidden p-0 rounded-2xl border border-[var(--border-glass)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--bg-secondary)]/60 text-[var(--text-muted)] font-semibold border-b border-[var(--border-glass)] uppercase text-[10px]">
              <tr>
                <th className="p-4 w-10 text-center">
                  <button onClick={toggleSelectAll}>
                    {selectedIds.length > 0 && selectedIds.length === projects.length ? (
                      <CheckSquare className="w-4 h-4 text-[var(--accent-cyan)]" />
                    ) : (
                      <Square className="w-4 h-4 text-[var(--text-muted)]" />
                    )}
                  </button>
                </th>
                <th className="p-4">Project</th>
                <th className="p-4">Status</th>
                <th className="p-4">Flags</th>
                <th className="p-4">SEO Health</th>
                <th className="p-4">Updated</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-glass)]">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[var(--text-muted)]">
                    No projects found matching the criteria.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-[var(--bg-secondary)]/30 transition-colors">
                    <td className="p-4 text-center">
                      <button onClick={() => toggleSelectOne(project.id)}>
                        {selectedIds.includes(project.id) ? (
                          <CheckSquare className="w-4 h-4 text-[var(--accent-cyan)]" />
                        ) : (
                          <Square className="w-4 h-4 text-[var(--text-muted)]" />
                        )}
                      </button>
                    </td>

                    {/* Project Title & Image */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={project.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&q=80'}
                          alt={project.title}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-[var(--border-glass)]"
                        />
                        <div className="space-y-0.5">
                          <Link href={`/admin/projects/${project.id}`} className="font-bold text-[var(--text-primary)] hover:text-[var(--accent-cyan)] transition-colors">
                            {project.title}
                          </Link>
                          <p className="text-[10px] text-[var(--text-muted)] font-mono">/projects/{project.slug}</p>
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          project.status === 'PUBLISHED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : project.status === 'DRAFT'
                            ? 'bg-slate-500/20 text-slate-400 border border-slate-500/40'
                            : project.status === 'APPROVED'
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>

                    {/* Flags */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        {project.featured && <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" title="Featured" />}
                        {project.pinned && <Pin className="w-4 h-4 text-[var(--accent-cyan)]" title="Pinned" />}
                      </div>
                    </td>

                    {/* SEO Health Score */}
                    <td className="p-4">
                      <span className="font-mono text-xs font-bold text-[var(--accent-cyan)]">
                        {project.seoScore || 100} / 100
                      </span>
                    </td>

                    {/* Updated Date */}
                    <td className="p-4 text-[10px] text-[var(--text-muted)] font-mono">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </td>

                    {/* Quick Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="p-1.5 rounded-lg glass-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="p-1.5 rounded-lg glass-sm text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors"
                          title="Edit Project"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => onDuplicate(project.id)}
                          className="p-1.5 rounded-lg glass-sm text-[var(--text-muted)] hover:text-indigo-400 transition-colors"
                          title="Duplicate Project"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(project.id)}
                          className="p-1.5 rounded-lg glass-sm text-[var(--text-muted)] hover:text-rose-400 transition-colors"
                          title="Soft Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {meta.totalPages > 1 && (
          <div className="p-4 border-t border-[var(--border-glass)] flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>
              Showing page {meta.page} of {meta.totalPages} ({meta.total} total items)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={meta.page <= 1}
                onClick={() => onPageChange(meta.page - 1)}
                className="p-1.5 rounded-lg glass-sm disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={meta.page >= meta.totalPages}
                onClick={() => onPageChange(meta.page + 1)}
                className="p-1.5 rounded-lg glass-sm disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
