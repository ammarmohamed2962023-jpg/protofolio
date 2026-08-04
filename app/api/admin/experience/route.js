import { z } from 'zod';
import { decryptToken, COOKIE_NAME } from '@/lib/auth/session';
import { experienceRepository } from '@/server/repositories/experience.repository';
import { logRepository } from '@/server/repositories/log.repository';
import { apiSuccess, apiError } from '@/lib/api/response';

const experienceSchema = z.object({
  company: z.string().min(2, 'Company name required').max(100),
  position: z.string().min(2, 'Position required').max(100),
  location: z.string().optional().nullable(),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean().optional(),
  description: z.string().min(10, 'Description required'),
  technologies: z.array(z.string()).optional(),
  order: z.number().optional(),
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const isCurrent = searchParams.get('isCurrent');

    const items = await experienceRepository.findMany({ search, isCurrent });
    return apiSuccess(items, 'Experiences retrieved successfully', { count: items.length }, 200);
  } catch (error) {
    return apiError('INTERNAL_ERROR', 'Failed to fetch experience entries', 500);
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
    const validation = experienceSchema.safeParse(body);

    if (!validation.success) {
      return apiError('VALIDATION_ERROR', 'Invalid experience data', 400, validation.error.flatten().fieldErrors);
    }

    const payload = {
      ...validation.data,
      startDate: new Date(validation.data.startDate),
      endDate: validation.data.endDate ? new Date(validation.data.endDate) : null,
      technologies: validation.data.technologies || [],
    };

    const exp = await experienceRepository.create(payload);

    await logRepository.createAuditLog({
      action: 'EXPERIENCE_CREATE',
      entity: 'Experience',
      entityId: exp.id,
      newValues: exp,
      userId: user.userId,
    });

    return apiSuccess(exp, 'Experience entry created', {}, 201);
  } catch (error) {
    return apiError('INTERNAL_ERROR', 'Failed to create experience entry', 500);
  }
}
