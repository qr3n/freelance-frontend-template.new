import { NextConfig } from 'next';

const nextConfig = {
  webpack: (config: NextConfig) => {
    config.module.rules.push({
      test: /\.worker\.js$/,
      use: { loader: 'worker-loader' }
    });
    return config;
  },
  // Необходимо для работы Monaco Editor
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
