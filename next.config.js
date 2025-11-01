/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['ddragon.leagueoflegends.com'],
  },
  env: {
    RIOT_API_KEY: process.env.RIOT_API_KEY,
    AWS_REGION: process.env.AWS_REGION,
  },
};

module.exports = nextConfig;
