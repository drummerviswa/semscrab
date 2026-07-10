/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent playwright from being bundled into the server — it only runs locally
  serverExternalPackages: ['playwright', 'playwright-core'],
};

export default nextConfig;
