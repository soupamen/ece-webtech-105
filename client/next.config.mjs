const nextConfig = {
  // The repo root has its own lockfile (Supabase CLI); pin the app root to client/.
  turbopack: {
    root: import.meta.dirname,
  },
  experimental: {
    agentUpgrade: 'security',
  },
}

export default nextConfig
