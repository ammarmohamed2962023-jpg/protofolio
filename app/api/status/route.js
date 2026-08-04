import { apiSuccess } from '@/lib/api/response';

export async function GET() {
  return apiSuccess(
    {
      system: 'Enterprise Portfolio CMS',
      version: '2.0.0-Phase1.5',
      services: {
        database: 'PostgreSQL',
        auth: 'JWT (Jose)',
        resend: process.env.RESEND_API_KEY ? 'Configured' : 'Missing',
        gmail: process.env.GMAIL_APP_PASSWORD ? 'Configured' : 'Missing',
      },
    },
    'System status report',
    {},
    200
  );
}
