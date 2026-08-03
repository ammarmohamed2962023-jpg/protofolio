import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const event = await request.json();
    console.log('[Analytics Event]', event);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid analytics payload' },
      { status: 400 }
    );
  }
}
