/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'golfthehighsierra.com',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
  // Allow trailing slashes to match WordPress URL structure
  trailingSlash: true,
};

export default nextConfig;
