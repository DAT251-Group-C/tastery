import { Socket } from 'socket.io-client';
import { AgientProvider, TODO } from './types';

const registeredListeners = new Map<string, (...args: TODO[]) => TODO>();

const createProvider = (socket: Socket): AgientProvider => {
  const chat = (message: string): void => {
    socket.emit('chat', message);
  };

  const on = (event: string, fn: (...args: TODO[]) => TODO) => {
    registeredListeners.set(event, fn);
  };

  socket.on('response', async data => {
    const listener = registeredListeners.get('response');

    if (listener) {
      listener(data);
    }
  });

  return { chat, on };
};

export { createProvider };
