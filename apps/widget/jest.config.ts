module.exports = {
  displayName: 'widget',
  preset: 'jest.preset.js',
  globals: {
    'vue-jest': {
      tsConfig: 'apps/widget/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.ts$': 'ts-jest',
  },
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  setupFilesAfterEnv: ['apps/widget/unit.setup.ts'],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'js', 'vue'],
  testTimeout: 10000,
};
