import { useCounterStore } from '@/stores/counter';
import { createAgient } from '@agient/widget';

type Functions = {
  increase: (data: { by: number }) => Promise<string>;
  multiply: (data: { by: number }) => Promise<string>;
};

const useAgient = () => {
  const counterStore = useCounterStore();
  const agient = createAgient<Functions>('api-key-1');

  agient.on('increase', async (data: { by: number }) => {
    if (Number.isNaN(Number(data.by))) {
      return 'Cannot increase because `by` is not a valid number. You provided ' + data.by;
    }

    await counterStore.increase(data.by);
    return `The count is now ${counterStore.count}`;
  });

  agient.on('multiply', async (data: { by: number }) => {
    if (Number.isNaN(Number(data.by))) {
      return 'Cannot multiply because `by` is not a valid number. You provided ' + data.by;
    }

    const { count } = counterStore;
    await counterStore.increase(count * data.by - count);
    return `The count is now ${counterStore.count}`;
  });
};

export { useAgient };
