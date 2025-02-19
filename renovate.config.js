module.exports = {
  repositories: ['MakairaIO/storefront-shop-adapter'],
  branchPrefix: 'renovate/',
  gitAuthor: process.env.GIT_AUTHOR,
  noAuth: false,
  hostRules: [
    {
      matchHost: 'ghcr.io',
      username: 'token',
      password: process.env.GITHUB_TOKEN,
      noAuth: false,
    },
  ],
}
