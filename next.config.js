/*https://life-dashboard-wmcp.vercel.app/dashboard** @type {import('next').NextConfig} */
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const nextConfig = {
    reactStrictMode: false,
    async headers() {
      return [
        {
          source: "/api/v1/:path*",
          headers: [
            {key: "Access-Control-Allow-Credentials", value: "true"},
            {key: "Access-Control-Allow-Origin", value: "https://life-dashboard-webapp-git-dev-gerard2par2.vercel.app"},
            {key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT"},
            {key: "Access-Control-Allow-Headers", value: "  X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-length, Content-MD5, Content-type, X-API-Version"},
          ]
        }
      ]  
    }, webpack: (config, { isServer, dev }) => {
      // Only run the plugin if it's not a server build
      if (!isServer) {
        config.plugins.push(new ForkTsCheckerWebpackPlugin({
          typescript: {
            files: "./app/**/*.{ts,tsx,js,jsx}" // Adjust this to where your files are
          }
        }));
      }
      return config;
    }
};

module.exports = nextConfig
