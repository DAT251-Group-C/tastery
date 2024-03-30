<template>
  <nav class="w-full grid grid-cols-[1fr,_auto] gap-x-4 items-center bg-primary-800 border-b border-neutral-700 py-2 px-5 h-12">
    <div class="flex gap-x-4 items-center h-8">
      <slot></slot>
    </div>
    <div class="flex gap-x-4 items-center h-8">
      <Button icon="inbox" text severity="neutral" badge="2" badgeSeverity="info"></Button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
</script>
