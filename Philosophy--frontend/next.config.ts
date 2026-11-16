import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // ✨ Force Next.js to compress images into next-gen formats
    formats: ["image/avif", "image/webp"],
    
    // Limits the target sizes generated to protect server resources
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [256, 384],
    
    // Cache optimized images for 60 days to maximize loading speeds
    minimumCacheTTL: 5184000,
  },
};

export default nextConfig;