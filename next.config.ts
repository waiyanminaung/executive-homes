import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "://unsplash.com" },
      { protocol: "https", hostname: "://icons8.com" },
      { protocol: "https", hostname: "://mux.com" },
      { protocol: "https", hostname: "://flowplayer.com" },
      { 
        protocol: "https", 
        hostname: "**.r2.dev",
        pathname: "/**" 
      },
    ],
  },
};


export default nextConfig;
