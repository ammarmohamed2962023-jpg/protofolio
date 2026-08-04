import prisma from '@/lib/prisma';

export class EducationRepository {
  async findMany({ search = '' } = {}) {
    try {
      const where = { deletedAt: null };
      if (search) {
        where.OR = [
          { institution: { contains: search, mode: 'insensitive' } },
          { degree: { contains: search, mode: 'insensitive' } },
          { fieldOfStudy: { contains: search, mode: 'insensitive' } },
        ];
      }

      return await prisma.education.findMany({
        where,
        orderBy: [{ order: 'asc' }, { startDate: 'desc' }],
      });
    } catch (err) {
      console.warn('[EducationRepository] findMany fallback:', err?.message);
      return [];
    }
  }

  async findById(id) {
    try {
      return await prisma.education.findUnique({ where: { id } });
    } catch (err) {
      return null;
    }
  }

  async create(data) {
    return prisma.education.create({ data });
  }

  async update(id, data) {
    return prisma.education.update({ where: { id }, data });
  }

  async softDelete(id) {
    return prisma.education.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export const educationRepository = new EducationRepository();
