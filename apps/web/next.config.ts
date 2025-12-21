import { config } from 'dotenv';
import { resolve } from 'path';
import type { NextConfig } from 'next';

// Load .env from monorepo root first, then from app root (app root overrides)
config({ path: resolve(__dirname, '../../.env') });
config({ path: resolve(__dirname, '.env'), override: true });

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone',

  // TODO: rewrites intead of /api/... routes
  
  // rewrites: [],
  // redirects
};

export default nextConfig;
