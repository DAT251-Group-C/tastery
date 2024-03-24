import io from 'socket.io-client';
import { createInstance } from './instance';
import { createProvider } from './provider';
import type { AgientFunctions, AgientInstance, AgientProvider } from './types';

const initialize = <TFunction extends AgientFunctions>(
  apiKey: string,
): { instance: AgientInstance<TFunction>; provider: AgientProvider } => {
  const socket = io('http://localhost:3000', {
    autoConnect: true,
    auth: {
      apiKey: apiKey,
    },
  });

  const provider = createProvider(socket);

  return {
    instance: createInstance(socket, provider),
    provider,
  };
};

export { initialize };
export type { AgientFunctions, AgientInstance, AgientProvider };
