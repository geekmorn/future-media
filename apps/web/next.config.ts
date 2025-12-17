import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone',

  // TODO: rewrites intead of /api/... routes
  
  // rewrites: [],
  // redirects
};

export default nextConfig;
