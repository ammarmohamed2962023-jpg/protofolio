'use client';
import { useState, useEffect } from 'react';
import { Briefcase, Plus, Calendar, MapPin, Building, Trash2 } from 'lucide-react';

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [isCurrent, setIsCurrent] = useState(true);
  const [description, setDescription] = useState('');

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function loadExperience() {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/experience');
        const data = await res.json();
        if (isMounted && data.success) setExperiences(data.data || []);
      } catch (err) {
        console.error('Fetch experience error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadExperience();
    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, position, location, startDate, isCurrent, description }),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setCompany('');
        setPosition('');
        setDescription('');
        setRefreshKey((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Create experience error:', err);
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
              Career Timeline
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
            Professional <span className="gradient-text">Experience</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] max-w-xl">
            Software engineering career history, company roles, tech stack accomplishments, and chronological timeline.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-[var(--glow-cyan)]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Career Role</span>
        </button>
      </div>

      {/* Experience Timeline Stream */}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="glass-card p-5 space-y-3 border border-[var(--border-glass)] rounded-2xl">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-[var(--accent-cyan)]" />
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">{exp.position}</h3>
                  <span className="text-xs text-[var(--accent-cyan)] font-semibold">@ {exp.company}</span>
                  {exp.isCurrent && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono">
                      Current Position
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-[10px] text-[var(--text-muted)] font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(exp.startDate).toLocaleDateString()} - {exp.isCurrent ? 'Present' : 'Ended'}
                  </span>
                  {exp.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {exp.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{exp.description}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-6 space-y-4 rounded-3xl border border-[var(--border-glass)]">
            <h3 className="text-base font-bold text-[var(--text-primary)]">Add Career Experience Role</h3>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--text-secondary)]">Job Position *</label>
                  <input
                    type="text"
                    required
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g. Senior Backend Engineer"
                    className="form-input mt-1 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-[var(--text-secondary)]">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Enterprise Solutions Corp"
                    className="form-input mt-1 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[var(--text-secondary)]">Key Responsibilities & Stack *</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Architected microservices, implemented C# backend endpoints..."
                  className="form-input mt-1 rounded-xl"
                />
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
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
