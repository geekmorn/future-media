interface SignInRequest {
  name: string;
  password: string;
}

interface SignInResponse {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    name: string;
  };
}

interface SignUpRequest {
  name: string;
  password: string;
}

interface SignUpResponse {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    name: string;
  };
}

export async function signIn(
  credentials: SignInRequest
): Promise<SignInResponse> {
  try {
    const response = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to sign in",
      };
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

export async function signUp(
  credentials: SignUpRequest
): Promise<SignUpResponse> {
  try {
    const response = await fetch("/api/auth/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to sign up",
      };
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

interface SignOutResponse {
  success: boolean;
  error?: string;
}

export async function signOut(): Promise<SignOutResponse> {
  try {
    const response = await fetch("/api/auth/sign-out", {
      method: "POST",
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        success: false,
        error: data.error || "Failed to sign out",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

