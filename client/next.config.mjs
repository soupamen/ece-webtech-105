const nextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  experimental: {
    agentUpgrade: 'security',
  },
}

export default nextConfig
