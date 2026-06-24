/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Tells Turbopack to skip bundling Prisma and let the runtime load it directly
    serverExternalPackages: ['@prisma/client'], 
    turbo: {
      resolveAlias: {
        // Fixes broken internal runtime paths for third-party tools
        '@prisma/client/runtime/library': '@prisma/client/runtime/client',
      },
    },
  },
};

export default nextConfig;
