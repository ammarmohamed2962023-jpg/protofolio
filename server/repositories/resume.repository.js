import prisma from '@/lib/prisma';

export class ResumeRepository {
  async findMany() {
    try {
      return await prisma.resumeVersion.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
      });
    } catch (err) {
      console.warn('[ResumeRepository] findMany fallback:', err?.message);
      return [
        {
          id: 'default_v2',
          version: 'v2.0',
          title: 'Ammar Mohammed - Senior Software Engineer Resume',
          fileUrl: '/resume.pdf',
          isActive: true,
          downloadsCount: 42,
        },
      ];
    }
  }

  async findActive() {
    try {
      return await prisma.resumeVersion.findFirst({
        where: { isActive: true, deletedAt: null },
      });
    } catch (err) {
      return null;
    }
  }

  async setActive(id) {
    await prisma.resumeVersion.updateMany({
      data: { isActive: false },
    });
    return prisma.resumeVersion.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async incrementDownload(id) {
    try {
      return await prisma.resumeVersion.update({
        where: { id },
        data: { downloadsCount: { increment: 1 } },
      });
    } catch (err) {
      return null;
    }
  }

  async create(data) {
    return prisma.resumeVersion.create({ data });
  }

  async softDelete(id) {
    return prisma.resumeVersion.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export const resumeRepository = new ResumeRepository();
