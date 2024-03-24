import type { AgientFunctions, AgientInstance } from './core';
import { initialize } from './core';
import { mountWidget } from './core/element';

const createAgient = <TFunctions extends AgientFunctions>(apiKey: string, options?: unknown): AgientInstance<TFunctions> => {
  console.log(apiKey);
  console.log(options);

  const { instance, provider } = initialize(apiKey);

  mountWidget(provider);

  return instance;
};

export { createAgient };
