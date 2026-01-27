/** @type {import('next').NextConfig} */
const nextConfig = {
  // สั่งปิดตาทุกการตรวจ 🙈
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
