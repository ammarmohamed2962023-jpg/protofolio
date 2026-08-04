'use client';
import { useState, useEffect } from 'react';
import { Code, Plus, Eye, EyeOff, Trash2, Search, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [level, setLevel] = useState(90);
  const [years, setYears] = useState(3);
  const [color, setColor] = useState('#00e5ff');

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function loadSkills() {
      setLoading(true);
      try {
        const query = new URLSearchParams({ search, categoryId: selectedCategory });
        const res = await fetch(`/api/admin/skills?${query}`);
        const data = await res.json();
        if (isMounted && data.success) {
          setSkills(data.data.skills || []);
          setCategories(data.data.categories || []);
        }
      } catch (err) {
        console.error('Fetch skills error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadSkills();
    return () => {
      isMounted = false;
    };
  }, [search, selectedCategory, refreshKey]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, level, years, color }),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setName('');
        setRefreshKey((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Create skill error:', err);
    }
  };

  const toggleVisibility = async (id, currentVis) => {
    try {
      await fetch('/api/admin/skills', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: currentVis ? 'hide' : 'show', ids: [id] }),
      });
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error('Toggle visibility error:', err);
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
              Skills Engine (v0.8.0)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
            Skills <span className="gradient-text">Management</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] max-w-xl">
            Categorized technical stack competencies, mastery progress, visibility toggles, and public API feeds.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-[var(--glow-cyan)]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="glass-card p-4 space-y-1">
          <div className="text-[var(--text-muted)]">Total Skills</div>
          <div className="text-xl font-black text-[var(--text-primary)]">{skills.length}</div>
        </div>
        <div className="glass-card p-4 space-y-1">
          <div className="text-[var(--text-muted)]">Visible</div>
          <div className="text-xl font-black text-emerald-400">{skills.filter((s) => s.isVisible).length}</div>
        </div>
        <div className="glass-card p-4 space-y-1">
          <div className="text-[var(--text-muted)]">Hidden</div>
          <div className="text-xl font-black text-slate-400">{skills.filter((s) => !s.isVisible).length}</div>
        </div>
        <div className="glass-card p-4 space-y-1">
          <div className="text-[var(--text-muted)]">Categories</div>
          <div className="text-xl font-black text-[var(--accent-cyan)]">{categories.length || 6}</div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-4 rounded-2xl">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="search"
            placeholder="Search skills by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-10 text-xs rounded-xl"
          />
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div key={skill.id} className="glass-card p-4 space-y-3 border border-[var(--border-glass)] hover:border-[var(--accent-cyan)]/40 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[var(--accent-cyan)]" />
                <h3 className="text-sm font-bold text-[var(--text-primary)]">{skill.name}</h3>
              </div>
              <button
                onClick={() => toggleVisibility(skill.id, skill.isVisible)}
                className={`p-1.5 rounded-lg text-xs font-bold ${
                  skill.isVisible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                }`}
              >
                {skill.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Level Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)]">
                <span>Mastery</span>
                <span>{skill.level}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[var(--accent-cyan)] rounded-full" style={{ width: `${skill.level}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Skill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 space-y-4 rounded-3xl border border-[var(--border-glass)]">
            <h3 className="text-base font-bold text-[var(--text-primary)]">Add Technical Skill</h3>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[var(--text-secondary)]">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. C# / .NET Core"
                  className="form-input mt-1 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--text-secondary)]">Level (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={level}
                    onChange={(e) => setLevel(Number(e.target.value))}
                    className="form-input mt-1 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-[var(--text-secondary)]">Years</label>
                  <input
                    type="number"
                    min="0"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="form-input mt-1 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-muted)]"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-5 py-2 rounded-xl text-xs font-bold">
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
