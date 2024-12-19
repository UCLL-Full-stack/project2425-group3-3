module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '\\.[jt]sx?$': 'esbuild-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/',
  ],
}