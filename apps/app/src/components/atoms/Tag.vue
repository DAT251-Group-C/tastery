<template>
  <Chip class="!text-neutral-100 text-caption outline-info" :style="{ backgroundColor: color }">
    <span>{{ tag }}</span>
  </Chip>
</template>

<script setup lang="ts">
import Chip from 'primevue/chip';
import { computed, toRefs } from 'vue';

const props = defineProps<{
  tag: string;
}>();

const getColorForString = (str: string): string => {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const outputHash = hash % 360;
  return `hsl(${outputHash}, 100%, 30%)`;
};

const { tag } = toRefs(props);

const color = computed(() => getColorForString(tag.value));
</script>
