import { z } from 'zod';
import { decryptToken, COOKIE_NAME } from '@/lib/auth/session';
import { projectRepository } from '@/server/repositories/project.repository';
import { projectService } from '@/server/services/project.service';
import { apiSuccess, apiError } from '@/lib/api/response';

const createProjectSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(150),
  slug: z.string().optional(),
  summary: z.string().min(10, 'Summary must be at least 10 characters').max(300),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  coverImage: z.string().optional().nullable(),
  demoUrl: z.string().url('Invalid Demo URL').optional().or(z.literal('')).nullable(),
  githubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')).nullable(),
  featured: z.boolean().optional(),
  featuredOrder: z.number().optional(),
  pinned: z.boolean().optional(),
  status: z.enum(['DRAFT', 'IN_REVIEW', 'APPROVED', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED']).optional(),
  client: z.string().optional().nullable(),
  projectType: z.string().optional(),
  completionDate: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || null;
    const categoryId = searchParams.get('categoryId') || null;
    const featured = searchParams.get('featured');
    const pinned = searchParams.get('pinned');
    const sort = searchParams.get('sort') || 'updatedAt_desc';

    const [result, metrics] = await Promise.all([
      projectRepository.findMany({ page, limit, search, status, categoryId, featured, pinned, sort }),
      projectRepository.getMetrics(),
    ]);

    return apiSuccess(result.items, 'Projects fetched successfully', { ...result.meta, metrics }, 200);
  } catch (error) {
    console.error('GET /api/admin/projects Error:', error);
    return apiError('INTERNAL_ERROR', 'Failed to fetch projects', 500);
  }
}

export async function POST(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const user = token ? await decryptToken(token) : null;

  if (!user) {
    return apiError('UNAUTHORIZED', 'Authentication required', 401);
  }

  try {
    const body = await request.json();
    const validation = createProjectSchema.safeParse(body);

    if (!validation.success) {
      return apiError('VALIDATION_ERROR', 'Invalid project data', 400, validation.error.flatten().fieldErrors);
    }

    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    const project = await projectService.createProject(validation.data, user.userId, { ip, userAgent });

    return apiSuccess(project, 'Project created successfully', {}, 201);
  } catch (error) {
    console.error('POST /api/admin/projects Error:', error);
    return apiError('INTERNAL_ERROR', 'Failed to create project', 500);
  }
}
