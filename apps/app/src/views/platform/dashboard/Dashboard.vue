<template>
  <div class="view">
    <h1>Dashboard</h1>
    <div class="flex flex-col items-center justify-center gap-6">
      <div class="flex gap-x-4">
        <div class="flex flex-col gap-y-4">
          <Button :size="selectedSize.code" :label="user"></Button>
          <Button severity="secondary" :size="selectedSize.code" :label="user"></Button>
          <Button severity="contrast" :size="selectedSize.code" :label="user"></Button>
          <Button severity="success" :size="selectedSize.code" :label="user"></Button>
          <Button severity="info" :size="selectedSize.code" :label="user"></Button>
          <Button severity="warning" :size="selectedSize.code" :label="user"></Button>
          <Button severity="danger" :size="selectedSize.code" :label="user"></Button>
        </div>
        <div class="flex flex-col gap-y-4">
          <Button :size="selectedSize.code" text :label="user"></Button>
          <Button severity="secondary" :size="selectedSize.code" text :label="user"></Button>
          <Button severity="contrast" :size="selectedSize.code" text :label="user"></Button>
          <Button severity="success" :size="selectedSize.code" text :label="user"></Button>
          <Button severity="info" :size="selectedSize.code" text :label="user"></Button>
          <Button severity="warning" :size="selectedSize.code" text :label="user"></Button>
          <Button severity="danger" :size="selectedSize.code" text :label="user"></Button>
        </div>
        <div class="flex flex-col gap-y-4">
          <Button :size="selectedSize.code" outlined :label="user"></Button>
          <Button severity="secondary" :size="selectedSize.code" outlined :label="user"></Button>
          <Button severity="contrast" :size="selectedSize.code" outlined :label="user"></Button>
          <Button severity="success" :size="selectedSize.code" outlined :label="user"></Button>
          <Button severity="info" :size="selectedSize.code" outlined :label="user"></Button>
          <Button severity="warning" :size="selectedSize.code" outlined :label="user"></Button>
          <Button severity="danger" :size="selectedSize.code" outlined :label="user"></Button>
        </div>
        <div class="flex flex-col gap-y-4">
          <Button :size="selectedSize.code" link :label="user"></Button>
          <Button severity="secondary" :size="selectedSize.code" link :label="user"></Button>
          <Button severity="contrast" :size="selectedSize.code" link :label="user"></Button>
          <Button severity="success" :size="selectedSize.code" link :label="user"></Button>
          <Button severity="info" :size="selectedSize.code" link :label="user"></Button>
          <Button severity="warning" :size="selectedSize.code" link :label="user"></Button>
          <Button severity="danger" :size="selectedSize.code" link :label="user"></Button>
        </div>
      </div>
      <Dropdown v-model="selectedSize" :placeholder="'Size'" optionLabel="name" :options="sizes"></Dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import { ref } from 'vue';

interface Size {
  name: string;
  code: 'small' | 'large' | undefined;
}

const sizes: Size[] = [
  {
    name: 'Small',
    code: 'small',
  },
  {
    name: 'Default',
    code: undefined,
  },
  {
    name: 'Large',
    code: 'large',
  },
];

const selectedSize = ref<Size>(sizes[1]);

const user = 'Eirik Måseidvåg';
</script>
