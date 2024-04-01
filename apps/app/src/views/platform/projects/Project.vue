<template>
  <div class="view">
    <h1>Overview</h1>
    <p>{{ project.name }}</p>
  </div>
</template>

<script setup lang="ts">
import { ApiFullProject } from '@/services/api/data-contracts';

const { project } = defineProps<{ project: ApiFullProject }>();
</script>
