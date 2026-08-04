'use client';
import { useState, useEffect } from 'react';
import { GraduationCap, Plus, Calendar, School } from 'lucide-react';

export default function AdminEducationPage() {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [startDate, setStartDate] = useState('2020-09-01');

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function loadEducation() {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/education');
        const data = await res.json();
        if (isMounted && data.success) setEducation(data.data || []);
      } catch (err) {
        console.error('Fetch education error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadEducation();
    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ institution, degree, fieldOfStudy, startDate }),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setInstitution('');
        setDegree('');
        setFieldOfStudy('');
        setRefreshKey((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Create education error:', err);
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
              Academic Background
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
            Academic <span className="gradient-text">Education</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] max-w-xl">
            University degrees, academic certifications, majors, and institutional credentials.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-[var(--glow-cyan)]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Academic Degree</span>
        </button>
      </div>

      {/* Education Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {education.map((edu) => (
          <div key={edu.id} className="glass-card p-5 space-y-2 border border-[var(--border-glass)] rounded-2xl">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[var(--accent-cyan)]" />
              <h3 className="text-sm font-bold text-[var(--text-primary)]">{edu.degree}</h3>
            </div>
            <p className="text-xs font-semibold text-[var(--accent-cyan)]">{edu.fieldOfStudy}</p>
            <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono pt-2 border-t border-[var(--border-glass)]">
              <span className="flex items-center gap-1">
                <School className="w-3.5 h-3.5" />
                {edu.institution}
              </span>
              <span>{new Date(edu.startDate).getFullYear()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 space-y-4 rounded-3xl border border-[var(--border-glass)]">
            <h3 className="text-base font-bold text-[var(--text-primary)]">Add Academic Degree</h3>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[var(--text-secondary)]">University / Institution *</label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. Modern Academy for Engineering"
                  className="form-input mt-1 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--text-secondary)]">Degree Title *</label>
                  <input
                    type="text"
                    required
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="Bachelor of Science"
                    className="form-input mt-1 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-[var(--text-secondary)]">Field of Study *</label>
                  <input
                    type="text"
                    required
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    placeholder="Computer Science"
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
                  Save Academic Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
