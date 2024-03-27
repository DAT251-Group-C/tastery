import { createAgient } from '@agient/widget';

let count = 0;

const increase = async (by: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      count += by;
      resolve(undefined);
    }, 1000);
  });
};

type Functions = {
  increase: (data: { by: number }) => Promise<string>;
  multiply: (data: { by: number }) => Promise<string>;
};

const useAgient = () => {
  const agient = createAgient<Functions>('api-key-1');

  agient.on('increase', async (data: { by: number }) => {
    if (Number.isNaN(Number(data.by))) {
      return 'Cannot increase because `by` is not a valid number. You provided ' + data.by;
    }

    await increase(data.by);
    return `The count is now ${count}`;
  });

  agient.on('multiply', async (data: { by: number }) => {
    if (Number.isNaN(Number(data.by))) {
      return 'Cannot multiply because `by` is not a valid number. You provided ' + data.by;
    }

    await increase(count * data.by - count);
    return `The count is now ${count}`;
  });
};

export { useAgient };
