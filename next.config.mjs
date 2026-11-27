/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [{ source: "/seamsfamiliar", destination: "/seams-familiar", permanent: true }];
  }
};

export default nextConfig;
