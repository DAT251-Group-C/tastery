import { createApp } from 'vue';
import App from './App.vue';
import './index.scss';
import router from './plugins/router';
import { useAgient } from './plugins/agient';
import { createPinia } from 'pinia';

const pinia = createPinia();

createApp(App).use(pinia).use(router).mount('#app');
useAgient();
