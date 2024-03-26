import { VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import './index.scss';
import prime from './plugins/prime';
import router from './plugins/router';

const pinia = createPinia();

createApp(App).use(pinia).use(VueQueryPlugin).use(prime).use(router).mount('#app');
// useAgient();
