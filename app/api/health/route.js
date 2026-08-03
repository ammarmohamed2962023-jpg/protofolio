import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      version: '2.0.0',
    },
    { status: 200 }
  );
}
