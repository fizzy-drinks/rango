/** @type {import('next').NextConfig} */
module.exports = {
  serverRuntimeConfig: {
    gameSeed: process.env.SEED || '0',
    pgUrl: process.env.PG_URL,
    ipgeoKey: process.env.IPGEO_KEY,
  },
};
