<template>
  <div class="view">
    <h1>Organizations</h1>
    <p class="text-neutral-400">Manage your existing organizations or create new ones</p>

    <div class="flex flex-wrap gap-4">
      <template v-if="isLoading">
        <Skeleton class="w-64 h-24 rounded-sm border border-neutral-700"></Skeleton>
      </template>
      <template v-else-if="data && data.length > 0">
        <div v-for="org in data" :key="org.id" class="p-4 ring-1 ring-neutral-700 bg-neutral-800 rounded-sm">
          <h3>{{ org.name }}</h3>
          <p>Created: {{ org.createdAt }}</p>
        </div>
      </template>
    </div>

    <div v-if="isError">
      <p>Error loading organizations</p>
    </div>

    <div v-else-if="data && data.length === 0">
      <p>No organizations</p>
    </div>

    <RouterLink to="/platform/organizations/new">
      <Button size="small" label="Create new organization"></Button>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import Skeleton from '@/components/Skeleton.vue';
import { useOrganizations } from '@/composables/organization';
import Button from 'primevue/button';

const { data, isLoading, isError } = useOrganizations();
</script>
