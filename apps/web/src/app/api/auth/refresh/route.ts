import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api/config";

export async function POST(request: NextRequest) {
  try {
    const cookies = request.headers.get("cookie") ?? "";

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        Cookie: cookies,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to refresh" },
        { status: response.status }
      );
    }

    // Create response
    const res = NextResponse.json({ success: true });

    // Forward new cookies from NestJS API
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      const cookies = setCookieHeader.split(/,(?=\s*\w+=)/);
      for (const cookie of cookies) {
        res.headers.append("set-cookie", cookie.trim());
      }
    }

    return res;
  } catch (error) {
    console.error("Refresh proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
