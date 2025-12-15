import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL, config } from '@/lib/api/config';
import { forwardSetCookieHeader } from '@/lib/api/proxy';

export async function POST(request: NextRequest) {
  try {
    const cookies = request.headers.get('cookie') ?? '';

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { Cookie: cookies },
    });

    const data = await response.json();

    if (!response.ok) {
      const res = NextResponse.json(
        { error: data.message || 'Failed to refresh' },
        { status: response.status },
      );

      res.cookies.set('accessToken', '', {
        httpOnly: true,
        secure: config.isProduction,
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });
      res.cookies.set('refreshToken', '', {
        httpOnly: true,
        secure: config.isProduction,
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });

      return res;
    }

    const res = NextResponse.json({ success: true });
    forwardSetCookieHeader(response, res);

    return res;
  } catch (error) {
    console.error('Refresh proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
