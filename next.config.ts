import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [90],
    remotePatterns: [{ protocol: "https", hostname: "**.medium.com" }],
  },
};

export default nextConfig;
