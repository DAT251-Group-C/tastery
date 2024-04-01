<template>
  <div class="view">
    <h1>Tools</h1>
    <p>{{ project?.name }}</p>
  </div>
</template>

<script setup lang="ts">
import { useProject } from '@/composables/project';
import { toRefs } from 'vue';

const props = defineProps<{ projectId: string }>();
const { projectId } = toRefs(props);

const { data: project } = useProject(projectId);
</script>
