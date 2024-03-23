import { initialize } from '../src/socket';
import { createApp } from 'vue';
import Widget from '../src/Widget.vue';
import type { AgientFunctions, AgientInstance } from '../src/socket/types';

export const AGIENT_INSTANCE_TOKEN = Symbol('AGIENT_INSTANCE_TOKEN');

// eslint-disable-next-line
const createAgient = <TFunctions extends AgientFunctions = any>(apiKey: string, options?: unknown): AgientInstance<TFunctions> => {
  console.log(apiKey);
  console.log(options);

  const { instance, provider } = initialize(apiKey);

  // insert a div with the id 'agient-widget' into the DOM
  const widget = document.createElement('div');
  widget.id = 'agient-widget';
  widget.style.position = 'fixed';
  widget.style.bottom = '0';
  widget.style.right = '0';
  widget.style.zIndex = '9999';
  widget.style.margin = '2rem';

  document.body.appendChild(widget);

  createApp(Widget).provide(AGIENT_INSTANCE_TOKEN, provider).mount('#agient-widget');

  return instance;
};

export { createAgient };
