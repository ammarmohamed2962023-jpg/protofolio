/* eslint-disable @next/next/no-img-element */
'use client';
import { useState } from 'react';
import { Search, Share2, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ProjectSeoPreview({ title, summary, slug, coverImage, ogImage, seoScore = 100 }) {
  const [tab, setTab] = useState('google');

  const displayTitle = title || 'Project Title | Portfolio';
  const displaySummary = summary || 'Short summary of the project will appear here in search engine results.';
  const displayUrl = `https://ammarmohamed.dev/projects/${slug || 'example-project'}`;
  const displayImage = ogImage || coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80';

  return (
    <div className="glass-card space-y-4">
      {/* Header with SEO Score /100 Badge */}
      <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-3">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[var(--accent-cyan)]" />
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Search & Social Media Previews</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[var(--text-muted)] font-mono">SEO Score:</span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-black font-mono ${
              seoScore >= 80
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : seoScore >= 50
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
            }`}
          >
            {seoScore} / 100
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border-glass)] pb-2 text-xs">
        <button
          type="button"
          onClick={() => setTab('google')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
            tab === 'google' ? 'bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Google Search</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('facebook')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
            tab === 'facebook' ? 'bg-[var(--accent-blue)]/20 text-[var(--accent-blue)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Facebook OG</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('twitter')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
            tab === 'twitter' ? 'bg-sky-500/20 text-sky-400' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Twitter Card</span>
        </button>
      </div>

      {/* Preview Card Display */}
      {tab === 'google' && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 font-sans">
          <div className="text-[11px] text-emerald-400 font-mono truncate">{displayUrl}</div>
          <div className="text-sm font-semibold text-blue-400 hover:underline truncate cursor-pointer">{displayTitle}</div>
          <div className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{displaySummary}</div>
        </div>
      )}

      {tab === 'facebook' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden font-sans max-w-md mx-auto">
          <div className="h-44 bg-slate-800 relative">
            <img src={displayImage} alt="OG Preview" className="w-full h-full object-cover" />
          </div>
          <div className="p-3 bg-slate-950 space-y-1">
            <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">ammarmohamed.dev</div>
            <div className="text-xs font-bold text-white truncate">{displayTitle}</div>
            <div className="text-[11px] text-slate-400 line-clamp-2">{displaySummary}</div>
          </div>
        </div>
      )}

      {tab === 'twitter' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden font-sans max-w-md mx-auto flex flex-col">
          <div className="h-40 bg-slate-800 relative">
            <img src={displayImage} alt="Twitter Preview" className="w-full h-full object-cover" />
          </div>
          <div className="p-3 bg-slate-950 space-y-1 border-t border-slate-800">
            <div className="text-xs font-bold text-white truncate">{displayTitle}</div>
            <div className="text-[11px] text-slate-400 line-clamp-2">{displaySummary}</div>
            <div className="text-[9px] text-slate-500 font-mono flex items-center gap-1 mt-1">
              <span>🔗 ammarmohamed.dev</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
