import { apiSuccess } from '@/lib/api/response';

export async function GET() {
  return apiSuccess(
    {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
    },
    'Health check operational',
    {},
    200
  );
}
