import { FunctionDefinition } from 'openai/resources';

const getAvailableFunctionsByApiKey = async (apiKey: string): Promise<FunctionDefinition[]> => {
  const map = new Map<string, FunctionDefinition[]>();

  map.set('api-key-1', [
    {
      name: 'increase',
      description: 'Increases the counter by x',
      parameters: {
        type: 'object',
        properties: {
          by: {
            type: 'number',
            description: 'the amount to increase the counter by',
          },
          __context_message: {
            type: 'string',
            description: 'a short message to show while the task is being performed. Should describe what is happening in the background',
          },
        },
        required: ['by', '__context_message'],
      },
    },
    {
      name: 'multiply',
      description: 'Multiplies the counter by x',
      parameters: {
        type: 'object',
        properties: {
          by: {
            type: 'number',
            description: 'the amount to multiply the counter by',
          },
          __context_message: {
            type: 'string',
            description: 'a short message to show while the task is being performed. Should describe what is happening in the background',
          },
        },
        required: ['by', '__context_message'],
      },
    },
  ]);

  const functions = map.get(apiKey);

  if (functions) {
    return Promise.resolve(functions);
  } else {
    return Promise.reject(new Error('No functions available for this API key'));
  }
};

export { getAvailableFunctionsByApiKey };
