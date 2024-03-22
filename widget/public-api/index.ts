import { createApp } from 'vue';
import App from '../src/App.vue';

const createAgient = (apiKey: string, options: unknown) => {
  console.log(apiKey);
  console.log(options);

  // insert a div with the id 'agient-widget' into the DOM
  const widget = document.createElement('div');
  widget.id = 'agient-widget';
  widget.style.position = 'fixed';
  widget.style.bottom = '0';
  widget.style.right = '0';
  widget.style.zIndex = '9999';
  widget.style.margin = '2rem';

  document.body.appendChild(widget);

  // attach my vue component to the div
  const app = createApp(App);
  app.mount('#agient-widget');
};

export { createAgient };
