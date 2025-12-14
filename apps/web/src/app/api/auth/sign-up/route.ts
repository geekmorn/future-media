import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api/config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/auth/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to sign up" },
        { status: response.status }
      );
    }

    // Create response with user data
    const res = NextResponse.json({
      success: true,
      user: data.user,
    });

    // Forward cookies from NestJS API
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      const cookies = setCookieHeader.split(/,(?=\s*\w+=)/);
      for (const cookie of cookies) {
        res.headers.append("set-cookie", cookie.trim());
      }
    }

    return res;
  } catch (error) {
    console.error("Sign up proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
