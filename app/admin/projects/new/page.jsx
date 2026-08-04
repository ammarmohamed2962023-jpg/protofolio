'use client';
import ProjectForm from '@/components/admin/projects/ProjectForm';

export default function CreateProjectPage() {
  return (
    <div className="space-y-6">
      <ProjectForm isEdit={false} />
    </div>
  );
}
