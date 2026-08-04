'use client';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminEmptyState({ title = 'No Data Found', message = 'There are no items to display in this category yet.', onRetry }) {
  return (
    <div className="glass-card p-12 text-center flex flex-col items-center justify-center space-y-4">
      <div className="p-4 rounded-2xl glass-sm text-[var(--accent-cyan)] shadow-[var(--glow-cyan)]">
        <AlertCircle className="w-8 h-8" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h3 className="text-sm font-bold text-[var(--text-primary)]">{title}</h3>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 mt-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Page</span>
        </button>
      )}
    </div>
  );
}
