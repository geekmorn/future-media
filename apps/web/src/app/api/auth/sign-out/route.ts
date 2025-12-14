import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api/config";

export async function POST(request: NextRequest) {
  try {
    const cookies = request.headers.get("cookie") ?? "";

    const response = await fetch(`${API_BASE_URL}/auth/sign-out`, {
      method: "POST",
      headers: {
        Cookie: cookies,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to sign out" },
        { status: response.status }
      );
    }

    // Create response
    const res = NextResponse.json({ success: true });

    // Forward cookies from NestJS API (which clears them)
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      const cookies = setCookieHeader.split(/,(?=\s*\w+=)/);
      for (const cookie of cookies) {
        res.headers.append("set-cookie", cookie.trim());
      }
    }

    return res;
  } catch (error) {
    console.error("Sign out proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
