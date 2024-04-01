<template>
  <div class="view">
    <h1>Credentials</h1>
    <RouterLink :to="{ name: 'New credential' }">
      <Button>Create new API key</Button>
    </RouterLink>
    <p>{{ credentials }}</p>
  </div>
</template>

<script setup lang="ts">
import { useCredentials } from '@/composables/credential';
import { toRefs } from 'vue';

const props = defineProps<{ projectId: string }>();
const { projectId } = toRefs(props);

const { data: credentials } = useCredentials(projectId);
</script>
