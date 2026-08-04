import { careerService } from '@/server/services/career.service';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function GET() {
  try {
    const payload = await careerService.getPublicCareerPayload();
    return apiSuccess(payload, 'Public career payload retrieved successfully', {}, 200);
  } catch (error) {
    console.error('GET /api/career Error:', error);
    return apiError('INTERNAL_ERROR', 'Failed to retrieve public career data', 500);
  }
}
