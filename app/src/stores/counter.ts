import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  actions: {
    async increase(by: number) {
      console.log('increasing by', by);
      return new Promise<void>(resolve => {
        setTimeout(() => {
          this.count = this.count + by;
          resolve();
        }, 1000);
      });
    },
  },
});
