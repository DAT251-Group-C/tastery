<template>
  <ProjectWrapper v-if="isAuthenticated">
    <NotFoundTemplate class="min-h-[calc(100vh-3rem)]" />
  </ProjectWrapper>

  <NotFoundTemplate v-else class="min-h-screen" />
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import ProjectWrapper from '@/components/templates/ProjectWrapper.vue';
import NotFoundTemplate from './NotFoundTemplate.vue';

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);
</script>
