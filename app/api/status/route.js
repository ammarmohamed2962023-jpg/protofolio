import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      service: 'Ammar Portfolio API',
      status: 'operational',
      systems: {
        database: 'connected',
        cache: 'active',
        api: '100% operational',
      },
      lastChecked: new Date().toISOString(),
    },
    { status: 200 }
  );
}
