'use client';
import { useState, useEffect } from 'react';
import { FileText, Download, CheckCircle2, Upload, Eye } from 'lucide-react';

export default function AdminResumePage() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('/resume.pdf');
  const [version, setVersion] = useState('v2.1');
  const [title, setTitle] = useState('Ammar Mohammed - Senior Software Engineer Resume');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function loadResumes() {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/resume');
        const data = await res.json();
        if (isMounted && data.success) {
          setResumes(data.data || []);
          const active = data.data.find((r) => r.isActive);
          if (active) setPreviewUrl(active.fileUrl);
        }
      } catch (err) {
        console.error('Fetch resume error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadResumes();
    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('version', version);
      formData.append('title', title);

      const res = await fetch('/api/admin/resume', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setRefreshKey((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Upload resume error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSetActive = async (id) => {
    try {
      await fetch('/api/admin/resume', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error('Set active error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 glass-card border border-[var(--border-glass)] rounded-3xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="section-badge text-[10px]">CMS Phase 2B</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] font-mono">
              Resume Versions Engine
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
            Resume <span className="gradient-text">Management & PDF Preview</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] max-w-xl">
            Upload new PDF versions, single-click active version toggle, live PDF preview frame, and download telemetry.
          </p>
        </div>

        <label className="btn-primary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-[var(--glow-cyan)] cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Uploading PDF...' : 'Upload New PDF Version'}</span>
          <input type="file" accept="application/pdf" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card space-y-4">
          <h3 className="text-xs font-bold text-[var(--text-primary)] border-b border-[var(--border-glass)] pb-2 uppercase tracking-wider">
            Resume Versions
          </h3>

          <div className="space-y-3">
            {resumes.map((res) => (
              <div
                key={res.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between text-xs ${
                  res.isActive
                    ? 'glass-card border-[var(--accent-cyan)]/60 bg-[var(--accent-cyan)]/5'
                    : 'glass-sm border-[var(--border-glass)]'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[var(--accent-cyan)]" />
                    <span className="font-bold text-[var(--text-primary)]">{res.title}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-300">
                      {res.version}
                    </span>
                    {res.isActive && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono">
                        Active Resume
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-[var(--text-muted)] font-mono">
                    <span>Downloads: {res.downloadsCount || 0}</span>
                    <span>Uploaded: {new Date(res.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewUrl(res.fileUrl)}
                    className="p-2 rounded-xl glass-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    title="Preview PDF"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {!res.isActive && (
                    <button
                      onClick={() => handleSetActive(res.id)}
                      className="px-3 py-1.5 rounded-xl bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] font-bold text-[11px] hover:bg-[var(--accent-cyan)]/30"
                    >
                      Set Active
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card space-y-3 h-[600px] flex flex-col">
          <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-2">
            <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">Live PDF Preview</h3>
            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-bold text-[var(--accent-cyan)] hover:underline flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              Download
            </a>
          </div>

          <div className="flex-1 rounded-xl overflow-hidden bg-slate-900 border border-[var(--border-glass)]">
            <iframe src={previewUrl} className="w-full h-full border-none" title="Resume PDF Preview" />
          </div>
        </div>
      </div>
    </div>
  );
}
