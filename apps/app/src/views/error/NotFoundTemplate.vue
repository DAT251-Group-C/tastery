<template>
  <div class="flex items-center justify-center">
    <div class="m-8 flex gap-x-6">
      <div class="flex flex-col gap-y-2 mb-8">
        <h1 class="font-bold text-neutral-700">404</h1>
        <p class="text-neutral-700 mb-4">The page you are looking for does not exist</p>
        <RouterLink :to="{ name: 'Index' }">
          <Button label="Go to front page"></Button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
</script>
