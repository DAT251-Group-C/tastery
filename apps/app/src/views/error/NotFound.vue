<template>
  <NotFoundTemplate :class="className" />
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import NotFoundTemplate from './NotFoundTemplate.vue';

const props = withDefaults(defineProps<{ class?: string }>(), {
  class: 'min-h-[calc(100vh-3rem)]',
});

const { class: className } = toRefs(props);
</script>
