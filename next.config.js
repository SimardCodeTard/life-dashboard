/*https://life-dashboard-wmcp.vercel.app/dashboard** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    async headers() {
      return [
        {
          source: "/api/v1/:path*",
          headers: [
            {key: "Access-Control-Allow-Credentials", value: "true"},
            {key: "Access-Control-Allow-Origin", value: "https://life-dashboard-webapp-git-dev-gerard2par2.vercel.app"},
            {key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,HEAD"},
            {key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-length, Content-MD5, Content-type, X-API-Version"},
          ]
        }
      ]  
    },
    reactStrictMode: false,
};

module.exports = nextConfig
