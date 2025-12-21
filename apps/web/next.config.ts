import { config } from 'dotenv';
import { resolve } from 'path';
import type { NextConfig } from 'next';

config({ path: resolve(__dirname, '../../.env') });
config({ path: resolve(__dirname, '.env'), override: true });

const API_URL = process.env.API_URL || 'http://localhost:4050';

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'standalone',
  turbopack: {
    root: resolve(__dirname, '../..'),
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/api/auth/google',
        destination: `${API_URL}/api/auth/google/start`,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
