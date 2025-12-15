import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/api/config';
import { forwardSetCookieHeader } from '@/lib/api/proxy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/auth/sign-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to sign up' },
        { status: response.status },
      );
    }

    const res = NextResponse.json({ success: true, user: data.user });
    forwardSetCookieHeader(response, res);

    return res;
  } catch (error) {
    console.error('Sign up proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
