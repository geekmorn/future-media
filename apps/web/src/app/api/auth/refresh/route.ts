import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/api/config';

export async function POST(request: NextRequest) {
  try {
    const cookies = request.headers.get('cookie') ?? '';

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        Cookie: cookies,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Clear cookies on refresh failure so middleware can redirect
      const res = NextResponse.json(
        { error: data.message || 'Failed to refresh' },
        { status: response.status },
      );

      // Clear auth cookies
      res.cookies.set('accessToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });
      res.cookies.set('refreshToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });

      return res;
    }

    // Create response
    const res = NextResponse.json({ success: true });

    // Forward new cookies from NestJS API
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      const cookies = setCookieHeader.split(/,(?=\s*\w+=)/);
      for (const cookie of cookies) {
        res.headers.append('set-cookie', cookie.trim());
      }
    }

    return res;
  } catch (error) {
    console.error('Refresh proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
