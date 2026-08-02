'use client';
import { useState } from 'react';
import { ShieldAlert, Plus, X, Save } from 'lucide-react';

export default function AdminModal({ isOpen, onClose, onShowToast }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('desktop');
  const [desc, setDesc] = useState('');
  const [tech, setTech] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !desc || !tech) {
      onShowToast('Please fill all fields.', 'error');
      return;
    }

    const newProject = {
      id: 'custom-' + Date.now(),
      title,
      category,
      image: '/assets/images/project_alasar.png',
      description: desc,
      technologies: tech.split(',').map(t => t.trim()),
      github: 'https://github.com/ammar-mohamed',
      demo: 'https://github.com/ammar-mohamed'
    };

    const existing = JSON.parse(localStorage.getItem('custom_projects') || '[]');
    existing.push(newProject);
    localStorage.setItem('custom_projects', JSON.stringify(existing));

    onShowToast(`Project "${title}" saved to LocalStorage CMS! Reloading...`, 'success');
    setTimeout(() => location.reload(), 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--accent-cyan)] rounded-2xl p-6 shadow-[var(--accent-glow-strong)] space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-3">
          <span className="flex items-center gap-2 font-bold text-lg text-[var(--accent-cyan)]">
            <ShieldAlert className="w-5 h-5" /> Local CMS Admin Panel
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Project Title</label>
            <input
              type="text"
              placeholder="e.g. Smart IoT Network Monitor"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
            >
              <option value="desktop">Desktop Application</option>
              <option value="web">Web Application</option>
              <option value="networking">Networking Lab</option>
              <option value="ai">AI / Data</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Description</label>
            <textarea
              rows="3"
              placeholder="Brief project summary..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Technologies (comma separated)</label>
            <input
              type="text"
              placeholder="C#, SQL Server, WinForms"
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> Save Project to Portfolio
          </button>
        </form>
      </div>
    </div>
  );
}
