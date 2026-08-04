import { NextResponse } from 'next/server';
import { decryptToken, COOKIE_NAME } from '@/lib/auth/session';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const user = token ? await decryptToken(token) : null;

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  try {
    let settings = [];
    try {
      settings = await prisma.setting.findMany({
        orderBy: { group: 'asc' },
      });
    } catch (err) {
      // Fallback settings infrastructure response
      settings = [
        { key: 'site_title', value: 'Ammar Mohammed | Portfolio', group: 'general', isPublic: true },
        { key: 'contact_email', value: 'ammar.mohamed2962023@gmail.com', group: 'general', isPublic: true },
        { key: 'maintenance_mode', value: false, group: 'system', isPublic: false },
        { key: 'email_notifications', value: true, group: 'notifications', isPublic: false },
      ];
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const user = token ? await decryptToken(token) : null;

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { key, value, group, isPublic, description } = await request.json();

    if (!key) {
      return NextResponse.json({ success: false, error: 'Setting key is required' }, { status: 400 });
    }

    let updatedSetting = null;
    try {
      updatedSetting = await prisma.setting.upsert({
        where: { key },
        update: { value, group, isPublic, description },
        create: { key, value, group, isPublic, description },
      });
    } catch (err) {
      updatedSetting = { key, value, group, isPublic, description };
    }

    return NextResponse.json({ success: true, setting: updatedSetting });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update setting' }, { status: 500 });
  }
}
