import type { NextConfig } from "next";

/**
 * STATIC_EXPORT=1 next build → plain static site in /out
 * (used for the hosted preview; normal builds keep image optimisation).
 */
const isStatic = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isStatic ? { output: "export" as const, trailingSlash: true } : {}),
  images: {
    unoptimized: isStatic,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2400],
  },
};

export default nextConfig;
