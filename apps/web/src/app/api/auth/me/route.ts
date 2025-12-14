import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api/config";

export async function GET(request: NextRequest) {
  try {
    const cookies = request.headers.get("cookie") ?? "";

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        Cookie: cookies,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Not authenticated" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      user: data.user,
    });
  } catch (error) {
    console.error("Get me proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
