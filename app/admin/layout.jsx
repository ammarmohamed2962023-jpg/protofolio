'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminNavbar from '@/components/admin/AdminNavbar';
import CommandPalette from '@/components/admin/CommandPalette';
import AdminErrorBoundary from '@/components/admin/AdminErrorBoundary';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    async function checkAuth() {
      if (isLoginPage) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();

        if (data.success && data.user) {
          setUser(data.user);
        } else {
          router.push('/admin/login');
        }
      } catch (err) {
        console.error('Admin Auth Check Error:', err);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      router.push('/admin/login');
    }
  };

  if (isLoginPage) {
    return <main className="min-h-screen bg-[var(--bg-primary)]">{children}</main>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[var(--accent-cyan)] to-[var(--accent-purple)] animate-spin" />
          <span className="text-xs font-bold text-[var(--text-muted)] font-mono">Loading CMS Shell...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans antialiased">
      {/* Sidebar */}
      <AdminSidebar
        user={user}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className={`transition-all duration-300 flex flex-col min-h-screen ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        <AdminNavbar
          user={user}
          onOpenPalette={() => setIsPaletteOpen(true)}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          <AdminErrorBoundary>{children}</AdminErrorBoundary>
        </main>
      </div>

      {/* Command Palette Modal */}
      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
    </div>
  );
}
