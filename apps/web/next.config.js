/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { version } = require('./package.json');

const ENV_FILES = ['.env', '.env.local', `.env.${process.env.NODE_ENV || 'development'}`];

ENV_FILES.forEach((file) => {
  require('dotenv').config({
    path: path.join(__dirname, `../../${file}`),
  });
});

/** @type {import('next').NextConfig} */
const config = {
  // other settings ...
  output: process.env.DOCKER_OUTPUT ? 'standalone' : undefined,
  experimental: {
    serverActionsBodySizeLimit: '50mb',
  },
  reactStrictMode: true,
  transpilePackages: [
    '@documenso/lib',
    '@documenso/prisma',
    '@documenso/trpc',
    '@documenso/ui',
    '@documenso/email',
  ],
  env: {
    APP_VERSION: version,
    NEXT_PUBLIC_PROJECT: 'web',
  },
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{ kebabCase member }}',
    },
  },
  webpack: (config, { isServer }) => {
    // fixes: Module not found: Can’t resolve ‘../build/Release/canvas.node’
    if (isServer) {
      config.resolve.alias.canvas = false;
    }

    return config;
  },
  async rewrites() {
    return [
      {
        source: '/ingest/:path*',
        destination: 'https://app.posthog.com/:path*',
      },
    ];
  },
  async redirects() {
    return [
      {
        permanent: true,
        source: '/fr/documents/:id/sign',
        destination: '/fr/sign/:token',
        has: [
          {
            type: 'query',
            key: 'token',
          },
        ],
      },
      {
        permanent: true,
        source: '/fr/documents/:id/signed',
        destination: '/fr/sign/:token',
        has: [
          {
            type: 'query',
            key: 'token',
          },
        ],
      },
    ];
  },
};

module.exports = config;
