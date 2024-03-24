import { Socket } from 'socket.io-client';
import { AgientFunctions, AgientInstance, AgientProvider } from './types';

const createInstance = <TFunction extends AgientFunctions>(socket: Socket, provider: AgientProvider): AgientInstance<TFunction> => {
  const on = (event: string, fn: AgientFunctions[number]) => {
    provider.registeredInstanceListeners.set(event, fn);
  };

  return { on };
};

export { createInstance };
