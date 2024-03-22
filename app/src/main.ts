import { createAgient } from '@agient/widget';
import { createApp } from 'vue';
import App from './App.vue';
import './index.scss';
import router from './plugins/router';

createApp(App).use(router).mount('#app');
createAgient('', '');
console.log('hello!!');
