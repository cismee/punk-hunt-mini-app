/** @type {import('next').NextConfig} */
const nextConfig = {
  // Silence warnings
  // https://github.com/WalletConnect/walletconnect-monorepo/issues/1908
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  // Add CSS handling
  experimental: {
    optimizePackageImports: ['nes.css', 'bootstrap']
  },
  // Allow importing CSS from node_modules
  transpilePackages: ['nes.css']
};

export default nextConfig;