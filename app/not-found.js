import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-24 flex flex-col">
      <Navbar onOpenTerminal={() => {}} />
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10">
        <div className="text-[120px] font-black font-mono leading-none gradient-text drop-shadow-[var(--glow-cyan)] mb-4 animate-float-y">
          404
        </div>
        <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-md">
          The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>
        <Link href="/" className="btn-primary px-8 py-3 rounded-full text-sm font-bold flex items-center gap-2">
          Return Home
        </Link>
      </div>
      <Footer onOpenAdmin={() => {}} />
      {/* Background Orbs */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="aurora-1 opacity-20" />
        <div className="aurora-3 opacity-20" />
      </div>
    </main>
  );
}
