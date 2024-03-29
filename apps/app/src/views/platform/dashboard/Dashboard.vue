<template>
  <div class="view">
    <div class="flex flex-col items-center justify-center gap-6"></div>
    <div v-for="org in items" :key="org.id">
      <p>{{ org.name }}</p>
    </div>
    <p v-if="hasNextPage" @click="fetchNextPage()">Load more</p>
  </div>
</template>

<script setup lang="ts">
import { useOrganizations } from '@/composables/organization';

const { items, hasNextPage, fetchNextPage } = useOrganizations();
</script>
