import { decryptToken, COOKIE_NAME } from '@/lib/auth/session';
import { careerService } from '@/server/services/career.service';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function GET(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const user = token ? await decryptToken(token) : null;

  if (!user) {
    return apiError('UNAUTHORIZED', 'Authentication required', 401);
  }

  try {
    const metrics = await careerService.getCareerMetrics();
    return apiSuccess(metrics, 'Career metrics retrieved', {}, 200);
  } catch (error) {
    return apiError('INTERNAL_ERROR', 'Failed to retrieve career metrics', 500);
  }
}
