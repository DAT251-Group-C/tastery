import PrimeVue, { type PrimeVueConfiguration } from 'primevue/config';
import type { Plugin } from 'vue';
import preset from './presets';

const prime: Plugin = {
  install(app) {
    app.use<PrimeVueConfiguration>(PrimeVue, {
      unstyled: true,
      pt: preset,
    });
  },
};

export default prime;
