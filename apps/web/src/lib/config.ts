const API_URL = process.env.API_URL || 'http://localhost:4050';

export const config = {
  api: {
    url: `${API_URL}/api`,
    baseUrl: API_URL,
  },
  isProduction: process.env.NODE_ENV === 'production',
} as const;
