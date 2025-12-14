/**
 * API client with automatic 401 handling:
 * 1. On 401 - attempt to refresh token
 * 2. If refresh succeeds - retry the original request
 * 3. If refresh fails - redirect to sign-in
 */

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
    });

    return response.ok;
  } catch {
    return false;
  }
}

async function handleRefresh(): Promise<boolean> {
  // If already refreshing, wait for that promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = refreshToken();

  try {
    const result = await refreshPromise;
    return result;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
}

function redirectToSignIn(): void {
  // Clear any stale state and redirect
  window.location.href = "/sign-in";
}

export interface ApiClientOptions extends RequestInit {
  skipAuthRetry?: boolean;
}

export async function apiClient<T>(
  url: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const { skipAuthRetry, ...fetchOptions } = options;

  const response = await fetch(url, fetchOptions);

  // Handle 401 Unauthorized
  if (response.status === 401 && !skipAuthRetry) {
    const refreshed = await handleRefresh();

    if (refreshed) {
      // Retry the original request
      const retryResponse = await fetch(url, fetchOptions);

      if (retryResponse.ok) {
        return retryResponse.json();
      }

      // If still 401 after refresh, redirect
      if (retryResponse.status === 401) {
        redirectToSignIn();
        throw new Error("Session expired");
      }

      // Handle other errors
      const data = await retryResponse.json();
      throw new Error(data.error || "Request failed");
    } else {
      // Refresh failed, redirect to sign-in
      redirectToSignIn();
      throw new Error("Session expired");
    }
  }

  // For non-401 errors or successful responses
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}
