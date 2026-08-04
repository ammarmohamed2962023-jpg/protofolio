import { skillRepository } from '../repositories/skill.repository';
import { experienceRepository } from '../repositories/experience.repository';
import { educationRepository } from '../repositories/education.repository';
import { resumeRepository } from '../repositories/resume.repository';
import { logRepository } from '../repositories/log.repository';

export class CareerService {
  async getPublicCareerPayload() {
    const [skills, experience, education, activeResume] = await Promise.all([
      skillRepository.findMany({ isVisible: true }),
      experienceRepository.findMany(),
      educationRepository.findMany(),
      resumeRepository.findActive(),
    ]);

    return {
      skills,
      experience,
      education,
      resume: activeResume || {
        version: 'v2.0',
        title: 'Ammar Mohammed - Senior Software Engineer Resume',
        fileUrl: '/resume.pdf',
        isActive: true,
      },
    };
  }

  async getCareerMetrics() {
    const [skills, experience, education, resumes] = await Promise.all([
      skillRepository.findMany(),
      experienceRepository.findMany(),
      educationRepository.findMany(),
      resumeRepository.findMany(),
    ]);

    const visibleSkills = skills.filter((s) => s.isVisible).length;
    const currentJobs = experience.filter((e) => e.isCurrent).length;
    const activeResume = resumes.find((r) => r.isActive);
    const totalDownloads = resumes.reduce((acc, r) => acc + (r.downloadsCount || 0), 0);

    return {
      skills: { total: skills.length, visible: visibleSkills, hidden: skills.length - visibleSkills },
      experience: { total: experience.length, currentJobs },
      education: { total: education.length },
      resume: { totalVersions: resumes.length, activeVersion: activeResume?.version || 'v2.0', totalDownloads },
    };
  }
}

export const careerService = new CareerService();
