import { z } from 'zod';
import { decryptToken, COOKIE_NAME } from '@/lib/auth/session';
import { educationRepository } from '@/server/repositories/education.repository';
import { logRepository } from '@/server/repositories/log.repository';
import { apiSuccess, apiError } from '@/lib/api/response';

const educationSchema = z.object({
  institution: z.string().min(2, 'Institution name required'),
  degree: z.string().min(2, 'Degree required'),
  fieldOfStudy: z.string().min(2, 'Field of study required'),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  order: z.number().optional(),
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const items = await educationRepository.findMany({ search });
    return apiSuccess(items, 'Education entries retrieved', { count: items.length }, 200);
  } catch (error) {
    return apiError('INTERNAL_ERROR', 'Failed to fetch education entries', 500);
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
    const validation = educationSchema.safeParse(body);

    if (!validation.success) {
      return apiError('VALIDATION_ERROR', 'Invalid education data', 400, validation.error.flatten().fieldErrors);
    }

    const payload = {
      ...validation.data,
      startDate: new Date(validation.data.startDate),
      endDate: validation.data.endDate ? new Date(validation.data.endDate) : null,
    };

    const edu = await educationRepository.create(payload);

    await logRepository.createAuditLog({
      action: 'EDUCATION_CREATE',
      entity: 'Education',
      entityId: edu.id,
      newValues: edu,
      userId: user.userId,
    });

    return apiSuccess(edu, 'Education entry created', {}, 201);
  } catch (error) {
    return apiError('INTERNAL_ERROR', 'Failed to create education entry', 500);
  }
}
