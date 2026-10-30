/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['three'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'eduplusplus.vercel.app', 
      'res.cloudinary.com'   // optional
    ],
  },
  env: {
    SITE_URL: 'https://eduplusplus.vercel.app',
  },
};

export default nextConfig;
