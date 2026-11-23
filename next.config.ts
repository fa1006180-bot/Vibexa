import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "plghhgfxzasksdliyfsv.supabase.co",
      },
    ],
  },
};

export default nextConfig;