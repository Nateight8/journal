import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

type WebpackConfig = any; // Simplified type for webpack configuration

const nextConfig: NextConfig = {
  // Disable source maps in production
  productionBrowserSourceMaps: false,

  // Enable React Strict Mode
  reactStrictMode: true,

  // Enable Webpack optimizations
  webpack: (config: WebpackConfig, { isServer, dev }) => {
    // Only apply production optimizations
    if (!isServer && !dev) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: true,
        concatenateModules: true,
        minimize: true,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
              name: "vendors",
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    return config;
  },

  // Configure images
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 1 week
  },

  // Enable gzip compression
  compress: true,

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

// Conditionally add bundle analyzer in development
export default process.env.ANALYZE
  ? withBundleAnalyzer({
      enabled: true,
    })(nextConfig)
  : nextConfig;
