export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Brand Logo Spinner */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-[var(--border-glass)] border-t-[var(--accent-cyan)] rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-2 border-[var(--border-glass)] border-b-[var(--accent-purple)] rounded-full animate-spin-reverse"></div>
          <span className="font-black text-sm text-[var(--text-primary)]">AM</span>
        </div>
        
        {/* Loading Text */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[var(--accent-cyan)] tracking-widest uppercase">
            Loading System
          </span>
          <span className="flex gap-0.5">
            <span className="w-1 h-1 rounded-full bg-[var(--accent-cyan)] animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1 h-1 rounded-full bg-[var(--accent-cyan)] animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1 h-1 rounded-full bg-[var(--accent-cyan)] animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
        </div>
      </div>
    </div>
  );
}
