/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Apenas arquivos que termine com essas extenções abaixo será considerado paginas.
  pageExtensions: ['page.tsx', 'api.ts', 'api.tsx'],
}

module.exports = nextConfig
