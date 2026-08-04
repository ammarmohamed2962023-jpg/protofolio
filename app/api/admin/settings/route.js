import { decryptToken, COOKIE_NAME } from '@/lib/auth/session';
import { settingsRepository } from '@/server/repositories/settings.repository';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function GET(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const user = token ? await decryptToken(token) : null;

  if (!user || user.role !== 'ADMIN') {
    return apiError('FORBIDDEN', 'ADMIN role required to access settings', 403);
  }

  try {
    const settings = await settingsRepository.getAll();
    return apiSuccess({ settings }, 'System settings retrieved', { count: settings.length }, 200);
  } catch (error) {
    return apiError('INTERNAL_ERROR', 'Failed to fetch settings', 500);
  }
}

export async function PUT(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const user = token ? await decryptToken(token) : null;

  if (!user || user.role !== 'ADMIN') {
    return apiError('FORBIDDEN', 'ADMIN role required to modify settings', 403);
  }

  try {
    const { key, value, category, type, description, isPublic } = await request.json();

    if (!key) {
      return apiError('VALIDATION_ERROR', 'Setting key is required', 400);
    }

    const updatedSetting = await settingsRepository.upsert(key, { value, category, type, description, isPublic });
    return apiSuccess({ setting: updatedSetting }, 'Setting updated successfully', {}, 200);
  } catch (error) {
    return apiError('INTERNAL_ERROR', 'Failed to update setting', 500);
  }
}
