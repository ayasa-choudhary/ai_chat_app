/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['flagcdn.com', 'upload.wikimedia.org'],
  },
  webpack: (config, { dev, isServer }) => {
    // Disable webpack caching to fix the "Unexpected end of object" error
    config.cache = false;
    return config;
  },
}

module.exports = nextConfig
