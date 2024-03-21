import { getJestProjects } from '@nx/jest';

export default {
  projects: getJestProjects(),
  setupFiles: ['<rootDir>/backend/jest/jest.setup.ts'],
};
