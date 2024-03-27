<template>
  <p>Test</p>
  <div v-for="project in data" :key="project.id">
    <p>{{ project.name }}</p>
  </div>
</template>

<script setup lang="ts">
import { useProjects } from '@/composables/project';

const { data } = useProjects();
</script>
