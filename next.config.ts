import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  // Static site generation configuration
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  
  // GitHub Pages support
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  
  // Image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Disable server-side features for static export
  experimental: {
    // Enable static export optimizations
    optimizePackageImports: ['@heroicons/react'],
  },
  
  // Build optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Turbopack configuration (empty to silence warnings)
  turbopack: {},
  
  // Asset optimization
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    
    return config;
  },
};

export default nextConfig;
