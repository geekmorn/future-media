const DEFAULT_API_URL = 'http://localhost:4050';

export const config = {
  api: {
    baseUrl: process.env.API_URL ?? `${DEFAULT_API_URL}/api`,
    publicBaseUrl: process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL,
  },
  isProduction: process.env.NODE_ENV === 'production',
} as const;
