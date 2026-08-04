import { z } from 'zod';
import { decryptToken, COOKIE_NAME } from '@/lib/auth/session';
import { skillRepository } from '@/server/repositories/skill.repository';
import { logRepository } from '@/server/repositories/log.repository';
import { apiSuccess, apiError } from '@/lib/api/response';

const skillSchema = z.object({
  name: z.string().min(2, 'Skill name required').max(100),
  level: z.number().min(1).max(100).optional(),
  years: z.number().min(0).max(50).optional(),
  color: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  order: z.number().optional(),
  isVisible: z.boolean().optional(),
  categoryId: z.string().optional().nullable(),
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || null;
    const isVisible = searchParams.get('isVisible');

    const skills = await skillRepository.findMany({ search, categoryId, isVisible });
    const categories = await skillRepository.findCategories();

    return apiSuccess({ skills, categories }, 'Skills retrieved successfully', { count: skills.length }, 200);
  } catch (error) {
    return apiError('INTERNAL_ERROR', 'Failed to fetch skills', 500);
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
    const validation = skillSchema.safeParse(body);

    if (!validation.success) {
      return apiError('VALIDATION_ERROR', 'Invalid skill data', 400, validation.error.flatten().fieldErrors);
    }

    const skill = await skillRepository.create(validation.data);

    await logRepository.createAuditLog({
      action: 'SKILL_CREATE',
      entity: 'Skill',
      entityId: skill.id,
      newValues: skill,
      userId: user.userId,
    });

    return apiSuccess(skill, 'Skill created successfully', {}, 201);
  } catch (error) {
    return apiError('INTERNAL_ERROR', 'Failed to create skill', 500);
  }
}

export async function PATCH(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const user = token ? await decryptToken(token) : null;

  if (!user) {
    return apiError('UNAUTHORIZED', 'Authentication required', 401);
  }

  try {
    const { action, ids } = await request.json();
    const count = await skillRepository.bulkAction(action, ids);
    return apiSuccess({ count }, 'Bulk action executed', {}, 200);
  } catch (error) {
    return apiError('INTERNAL_ERROR', 'Failed to execute bulk action', 500);
  }
}
