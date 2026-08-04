import prisma from '@/lib/prisma';

export class ProjectRepository {
  async findMany({
    page = 1,
    limit = 10,
    search = '',
    status = null,
    categoryId = null,
    featured = null,
    pinned = null,
    sort = 'updatedAt_desc',
  } = {}) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        deletedAt: null,
      };

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { summary: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } },
          { client: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (status) where.status = status;
      if (categoryId) where.categoryId = categoryId;
      if (featured !== null) where.featured = featured === true || featured === 'true';
      if (pinned !== null) where.pinned = pinned === true || pinned === 'true';

      const [sortField, sortOrder] = sort.split('_');
      const orderBy = { [sortField]: sortOrder || 'desc' };

      const [items, total] = await Promise.all([
        prisma.project.findMany({
          where,
          skip,
          take: limit,
          orderBy,
          include: {
            category: true,
            technologies: true,
            tags: true,
            images: { orderBy: { order: 'asc' } },
            analytics: true,
          },
        }),
        prisma.project.count({ where }),
      ]);

      return {
        items,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (err) {
      console.warn('[ProjectRepository] findMany fallback:', err?.message);
      return { items: [], meta: { total: 0, page: 1, limit, totalPages: 0 } };
    }
  }

  async findById(id) {
    try {
      return await prisma.project.findUnique({
        where: { id },
        include: {
          category: true,
          technologies: true,
          tags: true,
          images: { orderBy: { order: 'asc' } },
          versions: { orderBy: { version: 'desc' }, include: { changedBy: true } },
          slugRedirects: true,
          analytics: true,
        },
      });
    } catch (err) {
      console.warn('[ProjectRepository] findById error:', err?.message);
      return null;
    }
  }

  async findBySlug(slug) {
    try {
      return await prisma.project.findUnique({
        where: { slug },
        include: {
          category: true,
          technologies: true,
          tags: true,
          images: true,
          analytics: true,
        },
      });
    } catch (err) {
      return null;
    }
  }

  async findRedirect(oldSlug) {
    try {
      return await prisma.projectSlugRedirect.findUnique({
        where: { oldSlug },
        include: { project: true },
      });
    } catch (err) {
      return null;
    }
  }

  async create(data) {
    return prisma.project.create({
      data,
      include: {
        category: true,
        technologies: true,
        tags: true,
        images: true,
      },
    });
  }

  async update(id, data) {
    return prisma.project.update({
      where: { id },
      data,
      include: {
        category: true,
        technologies: true,
        tags: true,
        images: true,
      },
    });
  }

  async softDelete(id) {
    return prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id) {
    return prisma.project.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async permanentDelete(id) {
    return prisma.project.delete({
      where: { id },
    });
  }

  async createVersion(projectId, userId, changeSummary, snapshot) {
    try {
      const lastVersion = await prisma.projectVersion.findFirst({
        where: { projectId },
        orderBy: { version: 'desc' },
      });
      const nextVersionNum = (lastVersion?.version || 0) + 1;

      return await prisma.projectVersion.create({
        data: {
          projectId,
          version: nextVersionNum,
          changedById: userId && userId !== 'admin_root' ? userId : null,
          changeSummary,
          snapshot,
        },
      });
    } catch (err) {
      console.warn('[ProjectRepository] createVersion warning:', err?.message);
      return null;
    }
  }

  async addSlugRedirect(projectId, oldSlug, newSlug) {
    try {
      if (oldSlug === newSlug) return null;
      return await prisma.projectSlugRedirect.upsert({
        where: { oldSlug },
        update: { newSlug, projectId },
        create: { oldSlug, newSlug, projectId },
      });
    } catch (err) {
      return null;
    }
  }

  async getMetrics() {
    try {
      const [total, published, draft, featured, archived, pinned] = await Promise.all([
        prisma.project.count({ where: { deletedAt: null } }),
        prisma.project.count({ where: { status: 'PUBLISHED', deletedAt: null } }),
        prisma.project.count({ where: { status: 'DRAFT', deletedAt: null } }),
        prisma.project.count({ where: { featured: true, deletedAt: null } }),
        prisma.project.count({ where: { status: 'ARCHIVED', deletedAt: null } }),
        prisma.project.count({ where: { pinned: true, deletedAt: null } }),
      ]);

      return { total, published, draft, featured, archived, pinned };
    } catch (err) {
      return { total: 0, published: 0, draft: 0, featured: 0, archived: 0, pinned: 0 };
    }
  }

  async bulkAction(action, ids) {
    if (!ids || ids.length === 0) return 0;

    switch (action) {
      case 'softDelete':
        return prisma.project.updateMany({
          where: { id: { in: ids } },
          data: { deletedAt: new Date() },
        });
      case 'restore':
        return prisma.project.updateMany({
          where: { id: { in: ids } },
          data: { deletedAt: null },
        });
      case 'publish':
        return prisma.project.updateMany({
          where: { id: { in: ids } },
          data: { status: 'PUBLISHED' },
        });
      case 'archive':
        return prisma.project.updateMany({
          where: { id: { in: ids } },
          data: { status: 'ARCHIVED' },
        });
      case 'pin':
        return prisma.project.updateMany({
          where: { id: { in: ids } },
          data: { pinned: true },
        });
      case 'unpin':
        return prisma.project.updateMany({
          where: { id: { in: ids } },
          data: { pinned: false },
        });
      case 'permanentDelete':
        return prisma.project.deleteMany({
          where: { id: { in: ids } },
        });
      default:
        return 0;
    }
  }
}

export const projectRepository = new ProjectRepository();
