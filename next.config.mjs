// import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.r2.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: "/**",
      },
    ],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
  },
  // output: "standalone",
};
// if (process.env.NODE_ENV === "development") {
//   await setupDevPlatform();
// }
export default nextConfig;
