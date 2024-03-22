import { Socket } from 'socket.io-client';
import { AgientFunctions, AgientInstance } from './types';
import { ChatCompletionMessageToolCall, ChatCompletionToolMessageParam } from 'openai/resources';

const registeredListeners = new Map<string, AgientFunctions[number]>();

const createInstance = <TFunction extends AgientFunctions>(socket: Socket): AgientInstance<TFunction> => {
  const on = (event: string, fn: AgientFunctions[number]) => {
    registeredListeners.set(event, fn);
  };

  socket.on('tools_call', async (calls: ChatCompletionMessageToolCall[]) => {
    const response: Omit<ChatCompletionToolMessageParam, 'role'>[] = [];

    console.log('starting tools call', calls);

    // async for loop
    for (const call of calls) {
      const listener = registeredListeners.get(call.function.name);

      if (listener) {
        const result = await listener(JSON.parse(call.function.arguments));
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

  return { on };
};

export { createInstance };
