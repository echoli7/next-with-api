module.exports = {
    async rewrites() {
    return [
      {
        source: '/reflect',
        destination: '/blog',
      },
    ]
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}
