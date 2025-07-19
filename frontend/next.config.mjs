/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static page exports for Cloudflare Pages
  output: 'export',
  // Disable image optimization since we'll use standard img tags for Cloudflare Pages
  images: {
    unoptimized: true
  },
  // Ensure trailing slashes are handled correctly
  trailingSlash: false,
};

export default nextConfig;
