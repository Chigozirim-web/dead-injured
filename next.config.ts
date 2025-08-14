import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: "/about",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=172800, must-revalidate", // 2 days
          },
        ],
      },
      {
        source: "/rules",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=172800, must-revalidate", // 2 days
          },
        ],
      },
      {
        // Optional: Apply to all static assets in /public
        source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif|js|css)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
