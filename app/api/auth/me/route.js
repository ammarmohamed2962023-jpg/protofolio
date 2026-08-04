import { NextResponse } from 'next/server';
import { decryptToken, COOKIE_NAME } from '@/lib/auth/session';

export async function GET(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }

  const user = await decryptToken(token);
  if (!user) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }

  return NextResponse.json({ success: true, user });
}
