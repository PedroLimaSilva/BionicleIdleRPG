module.exports = {
  globals: {
    __APP_VERSION__: 'test',
    __POSTHOG_HOST__: 'https://us.i.posthog.com',
    __POSTHOG_KEY__: '',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^three/addons/(.*)$': '<rootDir>/src/test/mocks/threeTsl.cjs',
    '^three/tsl$': '<rootDir>/src/test/mocks/threeTsl.cjs',
    '^three/webgpu$': '<rootDir>/src/test/mocks/threeWebgpu.cjs',
  },
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts', '**/*.spec.tsx'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },
  transformIgnorePatterns: ['/node_modules/(?!three/)'],
};
