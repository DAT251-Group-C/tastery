<template>
  <div class="flex items-center justify-center">
    <div class="m-8 flex gap-x-6">
      <div class="flex flex-col gap-y-2 mb-8">
        <h1 class="font-bold text-neutral-200">404</h1>
        <p class="text-neutral-300 mb-4">The page you are looking for does not exist</p>
        <RouterLink v-if="isAuthenticated" :to="{ name: 'Projects' }">
          <Button label="Go to dashboard"></Button>
        </RouterLink>
        <RouterLink v-else :to="{ name: 'Index' }">
          <Button label="Go to front page"></Button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import { toRefs } from 'vue';

const props = defineProps<{ isAuthenticated: boolean }>();
const { isAuthenticated } = toRefs(props);
</script>
