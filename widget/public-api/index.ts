import { createApp } from 'vue';
import App from '../src/App.vue';

const createAgient = (apiKey: string, options: unknown) => {
  console.log(apiKey);
  console.log(options);

  // insert a div with the id 'agient-widget' into the DOM
  const widget = document.createElement('div');
  widget.id = 'agient-widget';
  document.body.appendChild(widget);

  // attach my vue component to the div
  const app = createApp(App);
  app.mount('#agient-widget');
};

export { createAgient };
