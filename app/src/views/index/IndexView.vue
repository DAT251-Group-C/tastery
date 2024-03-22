<template>
  <div class="container">
    <h2>Counter</h2>
    <h1 style="font-size: 128px">{{ count }}</h1>
  </div>
</template>

<script setup lang="ts">
import { useCounterStore } from '@/stores/counter';
import { storeToRefs } from 'pinia';

const counterStore = useCounterStore();
const { count } = storeToRefs(counterStore);
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  height: calc(100vh - 4rem);
  justify-content: center;
  align-items: center;
  padding-bottom: 4rem;
}

h1,
h2 {
  margin: 0;
}
</style>
