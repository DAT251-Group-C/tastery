import { createTestingPinia } from '@pinia/testing';
import { config } from '@vue/test-utils';
import sinon from 'sinon';

config.global.plugins.push([
  createTestingPinia({
    createSpy: sinon.spy,
  }),
]);
