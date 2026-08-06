import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No need to advertise the framework in every response header.
  poweredByHeader: false,
};

export default nextConfig;
