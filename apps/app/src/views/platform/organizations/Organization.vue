<template>
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
        <OrganizationGeneral :organization="organization" />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import Skeleton from '@/components/atoms/Skeleton.vue';
import { useOrganization } from '@/composables/organization';
import TabPanel from 'primevue/tabpanel';
import TabView from 'primevue/tabview';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import OrganizationGeneral from './settings/OrganizationGeneral.vue';

const activeTab = ref(0);

const router = useRouter();
const organizationId = String(router.currentRoute.value.params.key);

const { data: organization, isLoading, isError, isPlaceholderData } = useOrganization(organizationId);
</script>
