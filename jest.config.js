module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', { 
      tsconfig: 'tsconfig.json',
      diagnostics: {
        ignoreCodes: [2347]  // Ignore untyped function calls error
      }
    }]
  }
}; 