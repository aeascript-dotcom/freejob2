/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // เตือนเฉยๆ แต่ไม่ต้องสั่งหยุด build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // เตือนเฉยๆ แต่ไม่ต้องสั่งหยุด build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
