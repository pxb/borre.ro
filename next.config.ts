import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The copy review mode (#561) is for previews and local builds; on the live
  // site the switch is off and its code is left out of the bundle.
  env: { COPY_REVIEW: process.env.VERCEL_ENV === "production" ? "off" : "on" },
};

export default nextConfig;
