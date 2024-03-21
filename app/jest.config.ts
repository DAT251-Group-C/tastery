module.exports = {
  displayName: 'app',
  preset: '../jest.preset.js',
  globals: {
    'vue-jest': {
      tsConfig: './app/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.ts$': 'ts-jest',
  },
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  setupFilesAfterEnv: ['<rootDir>/unit.setup.ts'],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'js', 'vue'],
  testTimeout: 10000,
};
