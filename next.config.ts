import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "optcgapi.com",
        pathname: "/media/static/Card_Images/**"
      }
    ]
  }
};

export default nextConfig;
