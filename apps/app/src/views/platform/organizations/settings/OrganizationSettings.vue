<template>
  <template v-if="errorNotFound">
    <div class="w-full px-5 mx-auto mt-6 max-w-5xl">
      <h1>Organization not found</h1>

      <p class="text-body-small text-neutral-400 mt-6">It looks like the organization you are looking for doesn't exist.</p>
      <p class="text-body-small text-neutral-400 mb-6">Are you sure the link is correct?</p>

      <RouterLink to="/platform/organizations" class="mt-6">
        <Button size="small">Back to organizations</Button>
      </RouterLink>
    </div>
  </template>
  <template v-else-if="error">
    <div class="w-full px-5 mx-auto mt-6 max-w-5xl">
      <h1>An unknown error occurred</h1>

      <p class="text-body-small text-neutral-400 mt-6">We have been notified of this issue and will look into it.</p>

      <RouterLink to="/platform/organizations" class="mt-6">
        <Button size="small">Back to organizations</Button>
      </RouterLink>
    </div>
  </template>
  <template v-else>
    <div class="w-full px-5 space-y-6 mx-auto mt-6 max-w-5xl">
      <h1 v-if="organization">{{ organization.name }}</h1>
      <h1 v-else-if="isError">An error occurred</h1>
      <Skeleton v-else class="w-full max-w-md h-10 rounded-xs" />

      <TabView v-model:activeIndex="activeTab" :scrollable="true">
        <TabPanel header="General" />
        <TabPanel header="Members" />
      </TabView>
    </div>
    <hr class="border-neutral-700 -mt-px" />
    <div class="w-full px-5 space-y-6 mx-auto my-8 max-w-5xl">
      <template v-if="activeTab === 0">
        <template v-if="isLoading || isPlaceholderData">
          <Skeleton class="w-full h-[189px] rounded-sm ring-1 ring-neutral-700" />
          <Skeleton class="w-full h-[236px] rounded-sm ring-1 ring-neutral-700" />
        </template>
        <template v-else-if="organization">
          <OrganizationGeneral :key="organization.id" :organization="organization" />
        </template>
      </template>
    </div>
  </template>
</template>

<script setup lang="ts">
import Skeleton from '@/components/atoms/Skeleton.vue';
import { useOrganization } from '@/composables/organization';
import Button from 'primevue/button';
import TabPanel from 'primevue/tabpanel';
import TabView from 'primevue/tabview';
import { computed, ref } from 'vue';
import OrganizationGeneral from './OrganizationGeneral.vue';

const activeTab = ref(0);
const { organizationId } = defineProps<{ organizationId: string }>();
const { data: organization, isLoading, isError, error, isPlaceholderData } = useOrganization(organizationId);

const errorNotFound = computed(() => error.value?.response?.status === 404);
</script>
