import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "www.xyvnai.com",
      "ctdfdgirlrxgiuowttvw.supabase.co",
    ],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "10.10.20.24", // 
      },
    ],
  },
  output: "standalone",
};

export default nextConfig;
