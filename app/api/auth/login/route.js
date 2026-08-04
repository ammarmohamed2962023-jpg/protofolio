import { NextResponse } from 'next/server';
import { z } from 'zod';
import { encryptToken, verifyPassword, COOKIE_NAME } from '@/lib/auth/session';
import prisma from '@/lib/prisma';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Default admin credentials for demo / initial deployment
const DEFAULT_ADMIN = {
  email: 'admin@ammar.dev',
  // bcrypt hash for 'admin123456'
  passwordHash: '$2a$12$R.9Z9.0Nn7o3vG4T8v.W6uH.J8Vb8v1v8v1v8v1v8v1v8v1v8v1v8',
  name: 'Ammar Mohammed (Admin)',
  role: 'ADMIN',
  avatar: 'https://github.com/ammarmohamed2962023-jpg.png',
};

export async function POST(request) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;
    let user = null;

    // Check database if configured
    try {
      user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });
    } catch (dbErr) {
      console.warn('[CMS Auth] Database query bypassed/fallback used:', dbErr?.message);
    }

    let isValid = false;

    if (user) {
      isValid = await verifyPassword(password, user.passwordHash);
    } else if (email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase()) {
      // Default fallback admin check
      isValid = password === 'admin123456';
      user = {
        id: 'admin_root',
        email: DEFAULT_ADMIN.email,
        name: DEFAULT_ADMIN.name,
        role: DEFAULT_ADMIN.role,
        avatar: DEFAULT_ADMIN.avatar,
      };
    }

    if (!isValid || !user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar || 'https://github.com/ammarmohamed2962023-jpg.png',
    };

    const token = await encryptToken(payload);

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: payload,
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during login' },
      { status: 500 }
    );
  }
}
