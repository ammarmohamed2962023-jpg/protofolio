import { COOKIE_NAME } from '@/lib/auth/session';
import { apiSuccess } from '@/lib/api/response';

export async function POST() {
  const response = apiSuccess({}, 'Logged out successfully', {}, 200);
  response.cookies.delete(COOKIE_NAME);
  return response;
}
