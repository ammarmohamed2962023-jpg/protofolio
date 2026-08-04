'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (pathname === '/admin') {
    return (
      <nav aria-label="Breadcrumb" className="flex items-center text-xs text-[var(--text-muted)] font-medium">
        <span className="flex items-center gap-1.5 text-[var(--text-primary)]">
          <Home className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
          Dashboard
        </span>
      </nav>
    );
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-medium">
      <Link href="/admin" className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
        <Home className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
        Dashboard
      </Link>
      {segments.slice(1).map((segment, index) => {
        const url = `/admin/${segments.slice(1, index + 2).join('/')}`;
        const isLast = index === segments.length - 2;
        const formatted = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

        return (
          <div key={url} className="flex items-center space-x-1.5 rtl:space-x-reverse">
            <ChevronRight className="w-3 h-3 text-[var(--text-muted)] rtl:rotate-180" />
            {isLast ? (
              <span className="text-[var(--text-primary)] font-bold">{formatted}</span>
            ) : (
              <Link href={url} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                {formatted}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
