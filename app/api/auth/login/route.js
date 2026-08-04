import { NextResponse } from 'next/server';
import { z } from 'zod';
import { COOKIE_NAME } from '@/lib/auth/session';
import { authService } from '@/server/services/auth.service';
import { apiSuccess, apiError } from '@/lib/api/response';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return apiError('VALIDATION_ERROR', 'Invalid login payload', 400, validation.error.flatten().fieldErrors);
    }

    const { email, password } = validation.data;
    const authResult = await authService.authenticateUser(email, password);

    if (!authResult.success) {
      return apiError('UNAUTHORIZED', authResult.error || 'Invalid credentials', 401);
    }

    const response = apiSuccess(
      { user: authResult.user },
      'Authentication successful',
      { timestamp: new Date().toISOString() },
      200
    );

    response.cookies.set({
      name: COOKIE_NAME,
      value: authResult.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Login API Error:', error);
    return apiError('INTERNAL_ERROR', 'Internal server error during login', 500);
  }
}
