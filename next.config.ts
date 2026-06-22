import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "img.icons8.com" },
      { protocol: "https", hostname: "image.mux.com" },
      { protocol: "https", hostname: "cdn.flowplayer.com" },
      { protocol: "https", hostname: "*.r2.dev" },
      { protocol: "https", hostname: "pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev" },
    ],
  },
};


export default nextConfig;
