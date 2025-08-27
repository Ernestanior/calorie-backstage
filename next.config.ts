import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['www.xyvnai.com'], 
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '10.10.20.24', // 替换为你的图片域名
      },
    ],
  },
};

export default nextConfig;
