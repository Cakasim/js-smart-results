
module.exports = {
  testEnvironment: 'node',
  testRegex: '/tests/.*\\.spec\\.ts$',
  testPathIgnorePatterns: [
    'dist/index.js',
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ['text', 'html', 'clover'],
};
