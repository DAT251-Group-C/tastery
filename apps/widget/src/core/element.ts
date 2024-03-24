import { defineCustomElement } from 'vue';
import WidgetVue from '@/ui/Widget.vue';
import type { AgientProvider } from './types';
import tailwindStyles from '@resources/tailwind.css?inline&asset';

const mountWidget = (provider: AgientProvider) => {
  const customElement = defineCustomElement(WidgetVue);
  customElements.define('agient-widget', customElement);

  const instance = new customElement({ provider });

  instance.style.position = 'fixed';
  instance.style.bottom = '0';
  instance.style.right = '0';
  instance.style.zIndex = '9999';

  const style = document.createElement('style');
  style.textContent = tailwindStyles;
  instance.shadowRoot?.appendChild(style);

  document.body.appendChild(instance);
};

export { mountWidget };
