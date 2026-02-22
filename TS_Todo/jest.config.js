/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ["<rootDir>/__tests__/**/*.test.ts"],
  moduleNameMapper: {
    '^(\\.\\.?/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        rootDir: '.',
      },
    }],
  },
};
