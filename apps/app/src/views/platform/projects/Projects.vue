<template>
  <div class="platform-view my-6">
    <div class="flex gap-x-4 items-center">
      <RouterLink v-if="organizations.length > 0" to="/platform/projects/new" tabindex="-1">
        <Button size="small" label="New project"></Button>
      </RouterLink>
      <RouterLink to="/platform/organizations/new" tabindex="-1">
        <Button size="small" label="New organization" severity="neutral"></Button>
      </RouterLink>
    </div>

    <div
      v-if="isLoading || (organizations.length === 0 && !isLoading)"
      class="grid mb-10 grid-cols-1 sm:grid-cols-[repeat(auto-fit,_minmax(16rem,_24rem))] gap-6"
    >
      <template v-if="isLoading">
        <div>
          <Skeleton class="h-6 w-32 mb-4 rounded-xs"></Skeleton>
          <Skeleton class="min-h-32 sm:min-h-48 rounded-sm ring-1 ring-neutral-700"></Skeleton>
        </div>
      </template>
      <div v-else class="p-6 flex flex-col bg-neutral-900 ring-1 ring-neutral-800 rounded-sm">
        <p class="text-body-small-bold text-neutral-200">You dont have any organizations</p>
        <p class="text-caption text-neutral-400 mt-2">Create one to get started</p>
        <RouterLink to="/platform/organizations/new" tabindex="-1">
          <Button size="small" label="New organization" severity="neutral" class="self-start mt-6"></Button>
        </RouterLink>
      </div>
    </div>

    <div v-for="org in organizations" :key="org.id">
      <p class="text-body-large text-neutral-200 mb-4">{{ org.name }}</p>
      <div class="grid mb-10 grid-cols-1 sm:grid-cols-[repeat(auto-fit,_minmax(16rem,_24rem))] gap-6">
        <div
          v-if="org.projects.length === 0"
          class="p-6 flex flex-col bg-neutral-900 min-h-32 sm:min-h-48 ring-1 ring-neutral-800 rounded-sm"
        >
          <p class="text-body-small-bold text-neutral-200">No projects in organization</p>
          <p class="text-caption text-neutral-400 mt-2">Create one to get started</p>
          <RouterLink :to="{ path: '/platform/projects/new', query: { organizationId: org.id } }" tabindex="-1">
            <Button size="small" label="New project" severity="neutral" class="self-start mt-6"></Button>
          </RouterLink>
        </div>
        <template v-else>
          <RouterLink
            v-for="project in org.projects"
            :key="project.id"
            :to="`/platform/projects/${project.id}`"
            class="p-6 flex flex-col bg-neutral-800 min-h-32 sm:min-h-48 ring-1 ring-neutral-700 rounded-sm hover:bg-neutral-700 transition-colors group"
          >
            <div class="flex items-center justify-between">
              <p class="text-body-small-bold text-neutral-200">{{ project.name }}</p>
              <i class="font-symbol text-neutral-400 group-hover:text-neutral-200">chevron_right</i>
            </div>
            <p class="text-caption text-neutral-400">Last updated {{ toDateAgo(project.updatedAt) }}</p>
            <p class="text-caption text-neutral-400 mt-4">{{ project.description }}</p>
          </RouterLink>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Skeleton from '@/components/atoms/Skeleton.vue';
import { useOrganizations } from '@/composables/organization';
import { toDateAgo } from '@/utils/date';
import Button from 'primevue/button';

const { organizations, isLoading } = useOrganizations();
</script>
