import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   /* config options here */
//   images: {
//     domains: ['res.cloudinary.com'], // Add the domain here
//   },
// };

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https', // Allow HTTPS
        hostname: '**', // Allow ALL domains
      },
      // Optional: Add HTTP if needed (not recommended for production)
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
