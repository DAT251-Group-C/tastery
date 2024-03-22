<template>
  <div class="widget">
    <p>Hello!</p>
    <button @click="increment">count is: {{ count }}</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);

const increment = () => {
  count.value++;
};
</script>

<style scoped>
.widget {
  border-radius: 4px;
  border: 1px solid grey;
  padding: 2rem;
}
</style>
