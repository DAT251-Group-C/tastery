<template>
  <div class="platform-view">
    <h1>{{ response.data?.value?.name }}</h1>
    <p class="text-neutral-400">Manage your organization</p>
  </div>
</template>

<script setup lang="ts">
import { useOrganization } from '@/composables/organization';
import { useQueryClient } from '@tanstack/vue-query';
import { toRefs, watch } from 'vue';

const props = defineProps<{
  organizationId: string;
}>();

const { organizationId } = toRefs(props);
const queryClient = useQueryClient();

const response = useOrganization(organizationId);

watch(organizationId, () => {
  queryClient.invalidateQueries({ predicate: ({ queryKey }) => queryKey.includes('organization') });
});

const emits = defineEmits(['setTitle']);

watch(response.data, () => {
  emits('setTitle', response.data?.value?.name);
});
</script>
