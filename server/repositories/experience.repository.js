import prisma from '@/lib/prisma';

export class ExperienceRepository {
  async findMany({ search = '', isCurrent = null } = {}) {
    try {
      const where = { deletedAt: null };

      if (search) {
        where.OR = [
          { company: { contains: search, mode: 'insensitive' } },
          { position: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }
      if (isCurrent !== null) where.isCurrent = isCurrent === true || isCurrent === 'true';

      return await prisma.experience.findMany({
        where,
        orderBy: [{ order: 'asc' }, { startDate: 'desc' }],
      });
    } catch (err) {
      console.warn('[ExperienceRepository] findMany fallback:', err?.message);
      return [];
    }
  }

  async findById(id) {
    try {
      return await prisma.experience.findUnique({ where: { id } });
    } catch (err) {
      return null;
    }
  }

  async create(data) {
    return prisma.experience.create({ data });
  }

  async update(id, data) {
    return prisma.experience.update({ where: { id }, data });
  }

  async softDelete(id) {
    return prisma.experience.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async bulkAction(action, ids) {
    if (!ids || ids.length === 0) return 0;
    if (action === 'softDelete') {
      return prisma.experience.updateMany({
        where: { id: { in: ids } },
        data: { deletedAt: new Date() },
      });
    }
    return 0;
  }
}

export const experienceRepository = new ExperienceRepository();
