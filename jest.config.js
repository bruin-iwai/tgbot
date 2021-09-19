module.exports = {
  projects: [
    {
      displayName: 'test',
      clearMocks: true,
      testEnvironment: 'node',
      testPathIgnorePatterns: ['/node_modules/', '/__tests__/test-utils.js'],
    },
  ],
  collectCoverage: true,
  collectCoverageFrom: ['app/**/*.js'],
  coverageThreshold: {
    global: {
      statements: 95,
    },
  },
};
