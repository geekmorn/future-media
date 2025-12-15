import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/api/config';
import { forwardSetCookieHeader } from '@/lib/api/proxy';

export async function POST(request: NextRequest) {
  try {
    const cookies = request.headers.get('cookie') ?? '';

    const response = await fetch(`${API_BASE_URL}/auth/sign-out`, {
      method: 'POST',
      headers: { Cookie: cookies },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to sign out' },
        { status: response.status },
      );
    }

    const res = NextResponse.json({ success: true });
    forwardSetCookieHeader(response, res);

    return res;
  } catch (error) {
    console.error('Sign out proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
