<template>
  <div v-for="membership in organization.memberships" :key="membership.user.id">
    <p>{{ membership.user.name }}</p>
  </div>
</template>

<script setup lang="ts">
import { ApiFullOrganizationWithUsers } from '@/services/api/data-contracts';

const { organization } = defineProps<{ organization: ApiFullOrganizationWithUsers }>();
</script>
