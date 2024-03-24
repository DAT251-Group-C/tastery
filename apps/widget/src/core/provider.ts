import type { ChatCompletionMessageToolCall, ChatCompletionToolMessageParam } from 'openai/resources';
import { Socket } from 'socket.io-client';
import type { AgientFunctions, AgientProvider, TODO } from './types';

const registeredListeners = new Map<string, (...args: TODO[]) => TODO>();
const registeredInstanceListeners = new Map<string, AgientFunctions[number]>();

const createProvider = (socket: Socket): AgientProvider => {
  const chat = (message: string): void => {
    socket.emit('chat', message);
  };

  const on = (event: string, fn: (...args: TODO[]) => TODO) => {
    registeredListeners.set(event, fn);
  };

  const triggerListener = (event: string, ...args: TODO) => {
    const listener = registeredListeners.get(event);

    if (listener) {
      listener(...args);
    }
  };

  socket.on('response', async data => triggerListener('response', data));

  socket.on('tools_call', async (calls: ChatCompletionMessageToolCall[]) => {
    const response: Omit<ChatCompletionToolMessageParam, 'role'>[] = [];

    console.log('starting tools call', calls);

    for (const call of calls) {
      const listener = registeredInstanceListeners.get(call.function.name);

      if (listener) {
        triggerListener('before_tool_call', call);
        const result = await listener(JSON.parse(call.function.arguments));
        triggerListener('after_tool_call', call);
        response.push({
          content: result,
          tool_call_id: call.id,
        });
      } else {
        // TODO: should do more than this
        response.push({
          content: 'An error occurred, couldnt find function to call',
          tool_call_id: call.id,
        });
      }
    }

    console.log(response);

    socket.emit('tools_response', response);
  });

  return { chat, on, registeredInstanceListeners };
};

export { createProvider };
