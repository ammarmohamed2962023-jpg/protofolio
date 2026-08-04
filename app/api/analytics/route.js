import { apiSuccess, apiError } from '@/lib/api/response';

export async function POST(request) {
  try {
    const body = await request.json();
    return apiSuccess({ received: true, event: body?.event || 'pageview' }, 'Analytics event logged', {}, 200);
  } catch (err) {
    return apiError('INVALID_PAYLOAD', 'Failed to process analytics payload', 400);
  }
}
