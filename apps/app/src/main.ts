import { VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import './index.scss';
import prime from './plugins/prime';
import router from './plugins/router';
import ToastService from 'primevue/toastservice';

const pinia = createPinia();

createApp(App)
  .use(pinia)
  .use(VueQueryPlugin, { enableDevtoolsV6Plugin: !import.meta.env.PROD })
  .use(ToastService)
  .use(prime)
  .use(router)
  .mount('#app');
// useAgient();
