import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Enables forbidden()/unauthorized() so the Platform Dashboard can return
    // a real HTTP 403 to non-owners.
    authInterrupts: true,
  },
};

export default nextConfig;
