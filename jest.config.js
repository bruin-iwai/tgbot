module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['app/**/*.js'],
  coverageThreshold: {
    global: {
      statements: 95,
    },
  },
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/__tests__/test-utils.js'],
};
