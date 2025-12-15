let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
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

export interface ApiClientOptions extends RequestInit {
  skipAuthRetry?: boolean;
}

export async function apiClient<T>(url: string, options: ApiClientOptions = {}): Promise<T> {
  const { skipAuthRetry, ...fetchOptions } = options;

  const response = await fetch(url, fetchOptions);

  // Handle 401 Unauthorized
  if (response.status === 401 && !skipAuthRetry) {
    const refreshed = await handleRefresh();

    if (refreshed) {
      // Retry the original request
      const retryResponse = await fetch(url, fetchOptions);

      if (retryResponse.ok) {
        // Handle 204 No Content
        if (retryResponse.status === 204) {
          return undefined as T;
        }
        return retryResponse.json();
      }

      // If still 401 after refresh, throw error
      if (retryResponse.status === 401) {
        throw new Error('Session expired');
      }

      // Handle other errors
      const data = await retryResponse.json();
      throw new Error(data.error || 'Request failed');
    } else {
      // Refresh failed
      throw new Error('Session expired');
    }
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  // For non-401 errors or successful responses
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}
