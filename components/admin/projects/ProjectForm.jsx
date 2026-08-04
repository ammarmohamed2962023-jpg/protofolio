/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProjectSeoPreview from './ProjectSeoPreview';
import { Save, ArrowLeft, Upload, Link as LinkIcon, Code, Globe, Star, Pin, CheckCircle2, AlertCircle, Eye, RefreshCw, FileText } from 'lucide-react';

export default function ProjectForm({ initialData = null, isEdit = false }) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [isManualSlug, setIsManualSlug] = useState(false);
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [demoUrl, setDemoUrl] = useState(initialData?.demoUrl || '');
  const [githubUrl, setGithubUrl] = useState(initialData?.githubUrl || '');
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [featuredOrder, setFeaturedOrder] = useState(initialData?.featuredOrder || 0);
  const [pinned, setPinned] = useState(initialData?.pinned || false);
  const [status, setStatus] = useState(initialData?.status || 'DRAFT');
  const [client, setClient] = useState(initialData?.client || '');
  const [projectType, setProjectType] = useState(initialData?.projectType || 'Web Application');

  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription || '');
  const [ogImage, setOgImage] = useState(initialData?.ogImage || '');

  const [activeTab, setActiveTab] = useState('write');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState('');
  const [autosaved, setAutosaved] = useState(false);

  // Auto-slug generator
  useEffect(() => {
    if (!isManualSlug && title) {
      const generated = title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
      setSlug(generated);
    }
  }, [title, isManualSlug]);

  // 30s Autosave draft trigger
  useEffect(() => {
    const timer = setInterval(() => {
      if (title || summary) {
        localStorage.setItem('project_form_autosave', JSON.stringify({ title, summary, description, status: 'DRAFT', updatedAt: Date.now() }));
        setAutosaved(true);
        setTimeout(() => setAutosaved(false), 3000);
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [title, summary, description]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success && data.data?.url) {
        setCoverImage(data.data.url);
        setToast('Cover image uploaded successfully!');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const payload = {
      title,
      slug,
      summary,
      description,
      coverImage,
      demoUrl,
      githubUrl,
      featured,
      featuredOrder,
      pinned,
      status,
      client,
      projectType,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || summary,
      ogImage: ogImage || coverImage,
    };

    try {
      const url = isEdit ? `/api/admin/projects/${initialData.id}` : '/api/admin/projects';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        localStorage.removeItem('project_form_autosave');
        router.push('/admin/projects');
        router.refresh();
      } else {
        if (result.error?.details) {
          setErrors(result.error.details);
        } else {
          setToast(result.error?.message || 'Operation failed');
        }
      }
    } catch (err) {
      setToast('Network error saving project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 glass-card border border-[var(--border-glass)] rounded-2xl sticky top-20 z-20">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 rounded-xl glass-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-bold text-[var(--text-primary)]">
              {isEdit ? 'Edit Project' : 'Create New Project'}
            </h1>
            <p className="text-[10px] text-[var(--text-muted)] font-mono">
              {status} • {autosaved ? 'Autosaved' : 'Draft'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="form-input text-xs py-2 px-3 rounded-xl w-32 font-bold"
          >
            <option value="DRAFT">Draft</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="APPROVED">Approved</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-[var(--glow-cyan)]"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isEdit ? 'Update Project' : 'Save Project'}</span>
          </button>
        </div>
      </div>

      {toast && (
        <div className="p-3 rounded-xl bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30 text-[var(--accent-cyan)] text-xs font-semibold flex items-center justify-between">
          <span>{toast}</span>
          <button onClick={() => setToast('')} className="text-xs font-bold">Dismiss</button>
        </div>
      )}

      {/* Main Form Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Core Project Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Metadata Card */}
          <div className="glass-card space-y-4">
            <h3 className="text-xs font-bold text-[var(--text-primary)] border-b border-[var(--border-glass)] pb-2 uppercase tracking-wider">
              General Information
            </h3>

            {/* Title */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-[var(--text-secondary)]">Project Title *</label>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">{title.length} / 150</span>
              </div>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Enterprise Microservices Architecture"
                className="form-input text-xs rounded-xl"
              />
              {errors.title && <p className="text-[10px] text-rose-400">{errors.title[0]}</p>}
            </div>

            {/* Slug */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-[var(--text-secondary)]">URL Slug *</label>
                <button
                  type="button"
                  onClick={() => setIsManualSlug(!isManualSlug)}
                  className="text-[10px] text-[var(--accent-cyan)] hover:underline font-semibold"
                >
                  {isManualSlug ? 'Auto-Generate' : 'Manual Edit'}
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[var(--text-muted)]">/projects/</span>
                <input
                  type="text"
                  required
                  readOnly={!isManualSlug}
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="form-input pl-20 text-xs rounded-xl font-mono text-[var(--accent-cyan)]"
                />
              </div>
            </div>

            {/* Short Summary */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-[var(--text-secondary)]">Short Summary *</label>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">{summary.length} / 300</span>
              </div>
              <textarea
                rows={2}
                required
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief high-level summary of the project engineering value..."
                className="form-input text-xs rounded-xl"
              />
            </div>
          </div>

          {/* Full Markdown Description */}
          <div className="glass-card space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-2">
              <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">Full Description (Markdown)</h3>
              <div className="flex items-center gap-1 glass-sm p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md ${activeTab === 'write' ? 'bg-[var(--accent-cyan)] text-slate-950' : 'text-[var(--text-muted)]'}`}
                >
                  Editor
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md ${activeTab === 'preview' ? 'bg-[var(--accent-cyan)] text-slate-950' : 'text-[var(--text-muted)]'}`}
                >
                  Live Preview
                </button>
              </div>
            </div>

            {activeTab === 'write' ? (
              <textarea
                rows={12}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write full project details using Markdown syntax..."
                className="form-input text-xs rounded-xl font-mono"
              />
            ) : (
              <div className="p-4 rounded-xl glass-sm text-xs space-y-2 max-h-96 overflow-y-auto leading-relaxed">
                {description ? (
                  <div className="prose prose-invert max-w-none whitespace-pre-wrap">{description}</div>
                ) : (
                  <span className="text-[var(--text-muted)] italic">No description content written yet.</span>
                )}
              </div>
            )}
          </div>

          {/* SEO Live Previews */}
          <ProjectSeoPreview
            title={seoTitle || title}
            summary={seoDescription || summary}
            slug={slug}
            coverImage={coverImage}
            ogImage={ogImage}
          />
        </div>

        {/* Right Column (1 Col): Media, Links & Flags */}
        <div className="space-y-6">
          {/* Cover Image Upload */}
          <div className="glass-card space-y-3">
            <h3 className="text-xs font-bold text-[var(--text-primary)] border-b border-[var(--border-glass)] pb-2 uppercase tracking-wider">
              Cover Image
            </h3>

            {coverImage ? (
              <div className="relative rounded-xl overflow-hidden border border-[var(--border-glass)] h-40 bg-slate-900 group">
                <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setCoverImage('')}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-500 text-white text-[10px] font-bold shadow-md"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[var(--border-glass)] rounded-2xl cursor-pointer hover:border-[var(--accent-cyan)] transition-colors">
                <Upload className="w-6 h-6 text-[var(--accent-cyan)] mb-2" />
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  {uploading ? 'Uploading...' : 'Click to Upload Cover Image'}
                </span>
                <span className="text-[9px] text-[var(--text-muted)]">PNG, JPG, WebP up to 5MB</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>

          {/* Links Card */}
          <div className="glass-card space-y-3">
            <h3 className="text-xs font-bold text-[var(--text-primary)] border-b border-[var(--border-glass)] pb-2 uppercase tracking-wider">
              Project Links
            </h3>

            <div className="space-y-2 text-xs">
              <div>
                <label className="font-semibold text-[var(--text-secondary)]">Live Demo URL</label>
                <div className="relative mt-1">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <input
                    type="url"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="form-input pl-9 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[var(--text-secondary)]">GitHub Repository</label>
                <div className="relative mt-1">
                  <Code className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="form-input pl-9 text-xs rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Visibility Flags */}
          <div className="glass-card space-y-3 text-xs">
            <h3 className="text-xs font-bold text-[var(--text-primary)] border-b border-[var(--border-glass)] pb-2 uppercase tracking-wider">
              Visibility & Order
            </h3>

            <label className="flex items-center gap-3 p-2.5 rounded-xl glass-sm cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--accent-cyan)] focus:ring-0"
              />
              <div className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <span>Featured Project</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-2.5 rounded-xl glass-sm cursor-pointer">
              <input
                type="checkbox"
                checked={pinned}
                onChange={(e) => setPinned(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--accent-cyan)] focus:ring-0"
              />
              <div className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
                <Pin className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
                <span>Pin to Top</span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
