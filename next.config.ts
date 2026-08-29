import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: "..",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
