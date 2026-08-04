'use client';

export function StatCardSkeleton() {
  return (
    <div className="glass-card space-y-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="w-24 h-3 rounded bg-[var(--bg-secondary)]" />
        <div className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)]" />
      </div>
      <div className="w-32 h-6 rounded bg-[var(--bg-secondary)]" />
      <div className="w-20 h-2 rounded bg-[var(--bg-secondary)]" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-[var(--border-glass)] animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)]" />
        <div className="space-y-1.5">
          <div className="w-36 h-3 rounded bg-[var(--bg-secondary)]" />
          <div className="w-24 h-2.5 rounded bg-[var(--bg-secondary)]" />
        </div>
      </div>
      <div className="w-16 h-4 rounded bg-[var(--bg-secondary)]" />
    </div>
  );
}
