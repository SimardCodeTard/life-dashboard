/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    async headers() {
      return [
        {
          source: "/api/v1/:path*",
          headers: [
            key: "Access-Control-Allow-Origin", value: "*"
          ]
        }
      ]  
    }
};

module.exports = nextConfig
