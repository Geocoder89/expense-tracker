export default {
  preset: 'ts-jest', // Use ts-jest preset for TypeScript support
  testEnvironment: 'jsdom', // Use jsdom for testing React components
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Transform TypeScript files
  },
  moduleNameMapper: {
    // This is optional, but you might need this if you have any CSS or static files
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Optional setup file
  testPathIgnorePatterns: ['/node_modules/'], // Ignore node_modules
};
