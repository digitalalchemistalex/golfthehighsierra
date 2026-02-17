/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
  // Allow trailing slashes to match WordPress URL structure
  trailingSlash: true,
};

export default nextConfig;
