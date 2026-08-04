import { decryptToken, COOKIE_NAME } from '@/lib/auth/session';
import { projectRepository } from '@/server/repositories/project.repository';
import { projectService } from '@/server/services/project.service';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const project = await projectRepository.findById(id);

    if (!project) {
      return apiError('PROJECT_NOT_FOUND', `Project with ID ${id} not found`, 404);
    }

    return apiSuccess(project, 'Project details fetched', {}, 200);
  } catch (error) {
    return apiError('INTERNAL_ERROR', 'Failed to fetch project details', 500);
  }
}

export async function PUT(request, { params }) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const user = token ? await decryptToken(token) : null;

  if (!user) {
    return apiError('UNAUTHORIZED', 'Authentication required', 401);
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    const updated = await projectService.updateProject(id, body, user.userId, { ip, userAgent });

    if (!updated) {
      return apiError('PROJECT_NOT_FOUND', `Project with ID ${id} not found`, 404);
    }

    return apiSuccess(updated, 'Project updated successfully', {}, 200);
  } catch (error) {
    console.error('PUT /api/admin/projects/[id] Error:', error);
    return apiError('INTERNAL_ERROR', 'Failed to update project', 500);
  }
}

export async function DELETE(request, { params }) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const user = token ? await decryptToken(token) : null;

  if (!user || user.role !== 'ADMIN') {
    return apiError('FORBIDDEN', 'ADMIN role required for project deletion', 403);
  }

  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const permanent = searchParams.get('permanent') === 'true';

    if (permanent) {
      await projectRepository.permanentDelete(id);
      return apiSuccess({ id, permanent: true }, 'Project permanently deleted', {}, 200);
    } else {
      await projectRepository.softDelete(id);
      return apiSuccess({ id, permanent: false }, 'Project soft deleted', {}, 200);
    }
  } catch (error) {
    return apiError('INTERNAL_ERROR', 'Failed to delete project', 500);
  }
}

export async function PATCH(request, { params }) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const user = token ? await decryptToken(token) : null;

  if (!user) {
    return apiError('UNAUTHORIZED', 'Authentication required', 401);
  }

  try {
    const { id } = await params;
    const { action, ids } = await request.json();

    if (action === 'bulk') {
      const count = await projectRepository.bulkAction(ids?.action, ids?.ids || []);
      return apiSuccess({ count }, 'Bulk action executed', {}, 200);
    }

    if (action === 'restore') {
      const restored = await projectRepository.restore(id);
      return apiSuccess(restored, 'Project restored successfully', {}, 200);
    }

    if (action === 'duplicate') {
      const existing = await projectRepository.findById(id);
      if (!existing) return apiError('PROJECT_NOT_FOUND', 'Project not found', 404);

      const duplicated = await projectService.createProject({
        ...existing,
        title: `${existing.title} (Copy)`,
        slug: `${existing.slug}-copy`,
        status: 'DRAFT',
      }, user.userId);

      return apiSuccess(duplicated, 'Project duplicated successfully', {}, 201);
    }

    return apiError('BAD_REQUEST', 'Unknown PATCH action', 400);
  } catch (error) {
    return apiError('INTERNAL_ERROR', 'Failed to process patch action', 500);
  }
}
