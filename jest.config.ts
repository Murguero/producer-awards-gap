module.exports = {
  testEnvironment: 'node',
  globals: {
    isolatedModules: true,
  },
  testMatch: ['**/src/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};
