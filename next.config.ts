import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve AVIF where supported, then WebP, then fall back to the source format
    // for older browsers — negotiated automatically via the Accept header.
    // (Takes effect on the next dev/prod server start.)
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
