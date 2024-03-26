<template>
  <div class="flex flex-col items-center justify-center gap-6">
    <div class="flex gap-x-4">
      <div class="flex flex-col gap-y-4">
        <Button :size="size" :label="user"></Button>
        <Button severity="secondary" :size="size" :label="user"></Button>
        <Button severity="success" :size="size" :label="user"></Button>
        <Button severity="info" :size="size" :label="user"></Button>
        <Button severity="warning" :size="size" :label="user"></Button>
        <Button severity="danger" :size="size" :label="user"></Button>
        <Button severity="help" :size="size" :label="user"></Button>
        <Button severity="contrast" :size="size" :label="user"></Button>
      </div>
      <div class="flex flex-col gap-y-4">
        <Button :size="size" text :label="user"></Button>
        <Button severity="secondary" :size="size" text :label="user"></Button>
        <Button severity="success" :size="size" text :label="user"></Button>
        <Button severity="info" :size="size" text :label="user"></Button>
        <Button severity="warning" :size="size" text :label="user"></Button>
        <Button severity="danger" :size="size" text :label="user"></Button>
        <Button severity="help" :size="size" text :label="user"></Button>
        <Button severity="contrast" :size="size" text :label="user"></Button>
      </div>
      <div class="flex flex-col gap-y-4">
        <Button :size="size" outlined :label="user"></Button>
        <Button severity="secondary" :size="size" outlined :label="user"></Button>
        <Button severity="success" :size="size" outlined :label="user"></Button>
        <Button severity="info" :size="size" outlined :label="user"></Button>
        <Button severity="warning" :size="size" outlined :label="user"></Button>
        <Button severity="danger" :size="size" outlined :label="user"></Button>
        <Button severity="help" :size="size" outlined :label="user"></Button>
        <Button severity="contrast" :size="size" outlined :label="user"></Button>
      </div>
      <div class="flex flex-col gap-y-4">
        <Button :size="size" link :label="user"></Button>
        <Button severity="secondary" :size="size" link :label="user"></Button>
        <Button severity="success" :size="size" link :label="user"></Button>
        <Button severity="info" :size="size" link :label="user"></Button>
        <Button severity="warning" :size="size" link :label="user"></Button>
        <Button severity="danger" :size="size" link :label="user"></Button>
        <Button severity="help" :size="size" link :label="user"></Button>
        <Button severity="contrast" :size="size" link :label="user"></Button>
      </div>
      <div class="flex flex-col gap-y-4">
        <Button :size="size" icon="check" :label="user"></Button>
        <Button severity="secondary" :size="size" icon="check" :label="user"></Button>
        <Button severity="success" :size="size" icon="check" :label="user"></Button>
        <Button severity="info" :size="size" icon="check" :label="user"></Button>
        <Button severity="warning" :size="size" icon="check" :label="user"></Button>
        <Button severity="danger" :size="size" icon="check" :label="user"></Button>
        <Button severity="help" :size="size" icon="check" :label="user"></Button>
        <Button severity="contrast" :size="size" icon="check" :label="user"></Button>
      </div>
    </div>
    <select v-model="size">
      <option value="small">Small</option>
      <option :value="undefined">Default</option>
      <option value="large">Large</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';

import { ref } from 'vue';

const size = ref<'large' | 'small' | undefined>(undefined);

const user = 'Eirik Måseidvåg';
</script>
