<template>
  <div class="view">
    <h1>Settings</h1>
    <p>{{ project?.name }}</p>
    <Button label="Eirik Måseidvåg"></Button>
    <Button severity="secondary" label="Eirik Måseidvåg"></Button>
    <Button severity="neutral" label="Eirik Måseidvåg"></Button>
    <Button severity="success" label="Eirik Måseidvåg"></Button>
    <Button severity="info" label="Eirik Måseidvåg"></Button>
    <Button severity="warning" label="Eirik Måseidvåg"></Button>
    <Button severity="error" label="Eirik Måseidvåg"></Button>
  </div>
</template>

<script setup lang="ts">
import { useProject } from '@/composables/project';
import Button from 'primevue/button';
import { toRefs } from 'vue';

const props = defineProps<{ projectId: string }>();
const { projectId } = toRefs(props);

const { data: project } = useProject(projectId);
</script>
