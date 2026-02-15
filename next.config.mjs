/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'golfthehighsierra.com',
      },
    ],
  },
  async rewrites() {
    return [
      // Serve our custom HTML homepage at root
      // Other routes handled by Next.js normally
    ];
  },
};

export default nextConfig;
