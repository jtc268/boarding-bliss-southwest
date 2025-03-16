/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? 'https://boardingbliss-api.your-domain.com/api/:path*' // Replace with your API domain
          : 'http://localhost:3001/api/:path*', // Development API server
      },
    ];
  },
}

module.exports = nextConfig; 