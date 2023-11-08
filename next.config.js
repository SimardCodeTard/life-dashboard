/*https://life-dashboard-wmcp.vercel.app/dashboard** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    async headers() {
      return [
        {
          source: "/api/v1/:path*",
          headers: [
            {key: "Access-Control-Allow-Credentials", value: "true"},
<<<<<<< HEAD
            {key: "Access-Control-Allow-Origin", value: "https://life-dashboard-wmcp.vercel.app"},
=======
            {key: "Access-Control-Allow-Origin", value: "https://life-dashboard-webapp.vercel.app"},
>>>>>>> 394ca76 (fix(config): origin)
            {key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT"},
            {key: "Access-Control-Allow-Headers", value: "  X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-length, Content-MD5, Content-type, X-API-Version"},
          ]
        }
      ]  
    }
};

module.exports = nextConfig
