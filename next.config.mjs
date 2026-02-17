/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  async redirects() {
    return [
      // Old WordPress slugs → new clean slugs (301 permanent)
      { source: '/portfolio/atlantis-tower-rooms/', destination: '/portfolio/atlantis-tower-room/', permanent: true },
      { source: '/portfolio/atlantis-luxury-tower-rooms/', destination: '/portfolio/atlantis-luxury-tower-room/', permanent: true },
      { source: '/portfolio/atlantis-concierge-tower-rooms/', destination: '/portfolio/atlantis-concierge-tower-room/', permanent: true },
      { source: '/portfolio/atlantis-spa-suites/', destination: '/portfolio/atlantis-spa-suite/', permanent: true },
      { source: '/portfolio/atlantis-executive-spa-suites/', destination: '/portfolio/atlantis-executive-spa-suite/', permanent: true },
      { source: '/portfolio/atlantis-bar-suites/', destination: '/portfolio/atlantis-bar-suite/', permanent: true },
      { source: '/portfolio/atlantis-steakhouse-reno/', destination: '/portfolio/atlantis-steakhouse/', permanent: true },
      { source: '/portfolio/poppy-hills-golf-course-pebble-beach-ca/', destination: '/portfolio/poppy-hills-golf-course/', permanent: true },
      { source: '/portfolio/bayonet-black-horse-group-golf-seaside/', destination: '/portfolio/bayonet-black-horse-golf-course/', permanent: true },
    ];
  },
};

export default nextConfig;
