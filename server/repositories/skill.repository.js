import prisma from '@/lib/prisma';

export class SkillRepository {
  async findMany({ search = '', categoryId = null, isVisible = null } = {}) {
    try {
      const where = { deletedAt: null };

      if (search) {
        where.name = { contains: search, mode: 'insensitive' };
      }
      if (categoryId) where.categoryId = categoryId;
      if (isVisible !== null) where.isVisible = isVisible === true || isVisible === 'true';

      return await prisma.skill.findMany({
        where,
        orderBy: { order: 'asc' },
        include: { category: true },
      });
    } catch (err) {
      console.warn('[SkillRepository] findMany fallback:', err?.message);
      return [];
    }
  }

  async findCategories() {
    try {
      return await prisma.skillCategory.findMany({
        orderBy: { order: 'asc' },
        include: { skills: { where: { deletedAt: null } } },
      });
    } catch (err) {
      return [];
    }
  }

  async findById(id) {
    try {
      return await prisma.skill.findUnique({
        where: { id },
        include: { category: true },
      });
    } catch (err) {
      return null;
    }
  }

  async create(data) {
    return prisma.skill.create({
      data,
      include: { category: true },
    });
  }

  async update(id, data) {
    return prisma.skill.update({
      where: { id },
      data,
      include: { category: true },
    });
  }

  async softDelete(id) {
    return prisma.skill.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async bulkAction(action, ids) {
    if (!ids || ids.length === 0) return 0;
    switch (action) {
      case 'hide':
        return prisma.skill.updateMany({ where: { id: { in: ids } }, data: { isVisible: false } });
      case 'show':
        return prisma.skill.updateMany({ where: { id: { in: ids } }, data: { isVisible: true } });
      case 'softDelete':
        return prisma.skill.updateMany({ where: { id: { in: ids } }, data: { deletedAt: new Date() } });
      default:
        return 0;
    }
  }
}

export const skillRepository = new SkillRepository();
