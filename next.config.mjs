/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'getlancer.1a3c2f86a3386038e3a37e793a2777b5.r2.cloudflarestorage.com',
        pathname: '/getlancer/**',
      },
    ],
  },
  output: 'standalone',
};

export default nextConfig;