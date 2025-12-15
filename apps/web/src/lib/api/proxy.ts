import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from './config';

export interface ProxyOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  forwardCookies?: boolean;
  forwardBody?: boolean;
  forwardSetCookie?: boolean;
}

export function forwardSetCookieHeader(
  sourceResponse: Response,
  targetResponse: NextResponse,
): void {
  const setCookieHeader = sourceResponse.headers.get('set-cookie');
  if (setCookieHeader) {
    const cookies = setCookieHeader.split(/,(?=\s*\w+=)/);
    for (const cookie of cookies) {
      targetResponse.headers.append('set-cookie', cookie.trim());
    }
  }
}

export async function proxyRequest(
  request: NextRequest,
  endpoint: string,
  options: ProxyOptions = {},
): Promise<NextResponse> {
  const {
    method = 'GET',
    forwardCookies = true,
    forwardBody = false,
    forwardSetCookie = false,
  } = options;

  try {
    const headers: HeadersInit = {};

    if (forwardCookies) {
      headers.Cookie = request.headers.get('cookie') ?? '';
    }

    if (forwardBody && (method === 'POST' || method === 'PATCH')) {
      headers['Content-Type'] = 'application/json';
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    if (forwardBody && (method === 'POST' || method === 'PATCH')) {
      fetchOptions.body = JSON.stringify(await request.json());
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Request failed' },
        { status: response.status },
      );
    }

    const res = NextResponse.json(data);

    if (forwardSetCookie) {
      forwardSetCookieHeader(response, res);
    }

    return res;
  } catch (error) {
    console.error(`Proxy error for ${endpoint}:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
