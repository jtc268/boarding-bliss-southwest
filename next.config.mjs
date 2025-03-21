/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? 'https://your-api-server.com/api/:path*'
          : 'http://localhost:3001/api/:path*',
      },
    ];
  },
};

export default nextConfig; 