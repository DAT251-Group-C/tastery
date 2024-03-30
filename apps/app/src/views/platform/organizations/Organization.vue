<template>
  <OrganizationSettings :key="organizationId" :organizationId="organizationId" />
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import OrganizationSettings from './settings/OrganizationSettings.vue';

const props = defineProps<{ organizationId: string }>();
const { organizationId } = toRefs(props);
</script>
