import { projectRepository } from '../repositories/project.repository';
import { logRepository } from '../repositories/log.repository';

const RESERVED_SLUGS = ['new', 'edit', 'admin', 'api', 'create', 'delete', 'update', 'settings', 'projects'];

export class ProjectService {
  slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  }

  async generateUniqueSlug(title, currentId = null) {
    let baseSlug = this.slugify(title) || 'project';
    if (RESERVED_SLUGS.includes(baseSlug)) {
      baseSlug = `${baseSlug}-proj`;
    }

    let slug = baseSlug;
    let count = 1;

    while (true) {
      const existing = await projectRepository.findBySlug(slug);
      if (!existing || existing.id === currentId) {
        break;
      }
      slug = `${baseSlug}-${count}`;
      count++;
    }

    return slug;
  }

  calculateSeoScore(project) {
    let score = 100;
    const title = project.seoTitle || project.title || '';
    const desc = project.seoDescription || project.summary || '';

    if (!title || title.length < 10) score -= 20;
    else if (title.length > 70) score -= 10;

    if (!desc || desc.length < 30) score -= 25;
    else if (desc.length > 160) score -= 10;

    if (!project.coverImage) score -= 25;
    if (!project.ogImage) score -= 10;
    if (!project.demoUrl && !project.githubUrl) score -= 10;

    return Math.max(0, score);
  }

  async createProject(data, userId = null, reqMeta = {}) {
    const slug = data.slug
      ? await this.generateUniqueSlug(data.slug)
      : await this.generateUniqueSlug(data.title);

    const seoScore = this.calculateSeoScore({ ...data, slug });

    const createPayload = {
      title: data.title,
      slug,
      summary: data.summary,
      description: data.description,
      coverImage: data.coverImage || null,
      demoUrl: data.demoUrl || null,
      githubUrl: data.githubUrl || null,
      featured: Boolean(data.featured),
      featuredOrder: Number(data.featuredOrder || 0),
      pinned: Boolean(data.pinned),
      status: data.status || 'DRAFT',
      client: data.client || null,
      projectType: data.projectType || 'Web Application',
      completionDate: data.completionDate ? new Date(data.completionDate) : null,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      ogImage: data.ogImage || null,
      seoScore,
      categoryId: data.categoryId || null,
    };

    const project = await projectRepository.create(createPayload);

    // Save initial version snapshot
    await projectRepository.createVersion(project.id, userId, 'Initial Project Created', project);

    // Record Audit Log
    await logRepository.createAuditLog({
      action: 'PROJECT_CREATE',
      entity: 'Project',
      entityId: project.id,
      newValues: project,
      userId,
      ipAddress: reqMeta.ip,
      userAgent: reqMeta.userAgent,
      method: 'POST',
      route: '/api/admin/projects',
    });

    return project;
  }

  async updateProject(id, data, userId = null, reqMeta = {}) {
    const existing = await projectRepository.findById(id);
    if (!existing) return null;

    let slug = existing.slug;
    if (data.slug && data.slug !== existing.slug) {
      slug = await this.generateUniqueSlug(data.slug, id);
      await projectRepository.addSlugRedirect(id, existing.slug, slug);
    }

    const seoScore = this.calculateSeoScore({ ...existing, ...data, slug });

    const updatePayload = {
      title: data.title !== undefined ? data.title : existing.title,
      slug,
      summary: data.summary !== undefined ? data.summary : existing.summary,
      description: data.description !== undefined ? data.description : existing.description,
      coverImage: data.coverImage !== undefined ? data.coverImage : existing.coverImage,
      demoUrl: data.demoUrl !== undefined ? data.demoUrl : existing.demoUrl,
      githubUrl: data.githubUrl !== undefined ? data.githubUrl : existing.githubUrl,
      featured: data.featured !== undefined ? Boolean(data.featured) : existing.featured,
      featuredOrder: data.featuredOrder !== undefined ? Number(data.featuredOrder) : existing.featuredOrder,
      pinned: data.pinned !== undefined ? Boolean(data.pinned) : existing.pinned,
      status: data.status !== undefined ? data.status : existing.status,
      client: data.client !== undefined ? data.client : existing.client,
      projectType: data.projectType !== undefined ? data.projectType : existing.projectType,
      completionDate: data.completionDate ? new Date(data.completionDate) : existing.completionDate,
      seoTitle: data.seoTitle !== undefined ? data.seoTitle : existing.seoTitle,
      seoDescription: data.seoDescription !== undefined ? data.seoDescription : existing.seoDescription,
      ogImage: data.ogImage !== undefined ? data.ogImage : existing.ogImage,
      seoScore,
      version: existing.version + 1,
      categoryId: data.categoryId !== undefined ? data.categoryId : existing.categoryId,
    };

    const updated = await projectRepository.update(id, updatePayload);

    // Save version snapshot
    await projectRepository.createVersion(id, userId, data.changeSummary || 'Project Updated', updated);

    // Record Audit Log
    await logRepository.createAuditLog({
      action: 'PROJECT_UPDATE',
      entity: 'Project',
      entityId: id,
      previousValues: existing,
      newValues: updated,
      userId,
      ipAddress: reqMeta.ip,
      userAgent: reqMeta.userAgent,
      method: 'PUT',
      route: `/api/admin/projects/${id}`,
    });

    return updated;
  }
}

export const projectService = new ProjectService();
