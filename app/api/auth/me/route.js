import { decryptToken, COOKIE_NAME } from '@/lib/auth/session';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function GET(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return apiError('UNAUTHORIZED', 'Session token missing', 401);
  }

  const user = await decryptToken(token);
  if (!user) {
    return apiError('UNAUTHORIZED', 'Invalid or expired session token', 401);
  }

  return apiSuccess({ user }, 'User session profile fetched', {}, 200);
}
