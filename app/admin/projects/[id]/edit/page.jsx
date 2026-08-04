'use client';
import { useState, useEffect, use } from 'react';
import ProjectForm from '@/components/admin/projects/ProjectForm';
import AdminSkeletons from '@/components/admin/AdminSkeletons';

export default function EditProjectPage({ params }) {
  const { id } = use(params);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/admin/projects/${id}`);
        const data = await res.json();
        if (data.success) {
          setProject(data.data);
        }
      } catch (err) {
        console.error('Failed to load project for editing:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id]);

  if (loading) return <AdminSkeletons rows={5} />;
  if (!project) return <div className="p-8 text-center text-xs text-rose-400">Project not found.</div>;

  return (
    <div className="space-y-6">
      <ProjectForm initialData={project} isEdit={true} />
    </div>
  );
}
