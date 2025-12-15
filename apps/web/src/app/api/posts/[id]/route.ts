import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/api/config';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookies = request.headers.get('cookie') ?? '';
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to update post' },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Update post proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const cookies = request.headers.get('cookie') ?? '';

    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: {
        Cookie: cookies,
      },
    });

    if (!response.ok) {
      // Try to parse error response
      try {
        const data = await response.json();
        return NextResponse.json(
          { error: data.message || 'Failed to delete post' },
          { status: response.status },
        );
      } catch {
        return NextResponse.json({ error: 'Failed to delete post' }, { status: response.status });
      }
    }

    // 204 No Content
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Delete post proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
