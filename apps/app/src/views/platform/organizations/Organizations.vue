<template>
  <div class="view">
    <h1>Organizations</h1>
    <p class="text-neutral-400">Manage your existing organizations or create new ones</p>
    <RouterLink to="/platform/organizations/new">
      <Button size="small" label="Create new organization"></Button>
    </RouterLink>
    <div v-if="isLoading">
      <p>Loading...</p>
    </div>
    <div v-else-if="data" class="flex flex-wrap gap-4">
      <p v-if="data.length === 0" class="text-caption text-neutral-400">No organizations found</p>
      <div v-for="org in data" :key="org.id" class="p-4 ring-1 ring-neutral-700 bg-neutral-800 rounded-sm">
        <h3>{{ org.name }}</h3>
        <p>Created: {{ org.createdAt }}</p>
      </div>
    </div>
    <div v-else-if="isError">
      <p>Error loading organizations</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOrganizations } from '../../../plugins/tanstack/organization';
import Button from 'primevue/button';

const { data, isLoading, isError } = useOrganizations();
</script>
