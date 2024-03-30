<template>
  <form class="flex flex-col bg-neutral-800 ring-1 ring-neutral-700 rounded-sm" @submit.prevent="submit()">
    <div class="grid grid-cols-3 p-8">
      <span class="text-body-small text-neutral-200">General settings</span>
      <Control size="large" label="Organization name" class="col-span-2" hideDetails>
        <InputText v-model="name" size="large"></InputText>
      </Control>
    </div>

    <hr class="border-neutral-700" />

    <div class="flex items-center justify-end gap-x-2 px-8 py-4">
      <RouterLink to="/platform" tabindex="-1">
        <Button size="small" label="Cancel" severity="neutral"></Button>
      </RouterLink>
      <Button
        :disabled="organization?.name === name || isPending"
        :loading="isPending"
        type="submit"
        size="small"
        loadingIcon="progress_activity"
        label="Save"
      ></Button>
    </div>
  </form>

  <form class="flex flex-col bg-neutral-800 ring-1 ring-neutral-700 rounded-sm" @submit.prevent="submit()">
    <div class="p-8">
      <span class="text-body text-neutral-200">DANGER ZONE</span>

      <div class="flex rounded-xs ring-1 ring-error mt-8 bg-error-dark p-4">
        <i class="shrink-0 mr-4 font-symbol text-error">warning</i>
        <div>
          <p class="text-body-small text-neutral-200">Deleting this organization will also remove its projects</p>
          <p class="text-body-small text-neutral-400 mt-1 mb-4">Any chatbots using credentials from this project will no longer work.</p>
          <Button type="submit" severity="error" outlined size="small" label="Delete organization"></Button>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import Control from '@/components/atoms/Control.vue';
import { useUpdateOrganization } from '@/composables/organization';
import { useToaster } from '@/composables/toaster';
import { ApiFullOrganization } from '@/services/api/data-contracts';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { ref } from 'vue';

const { organization } = defineProps<{ organization: ApiFullOrganization }>();
const name = ref(organization.name);
const { mutateAsync: updateOrganization, isPending, error: updateError } = useUpdateOrganization();
const toast = useToaster();

const submit = async () => {
  try {
    await updateOrganization({ name: name.value, organizationId: organization.id });
    toast.add({ summary: 'Organization updated', detail: 'Your changes have been saved', severity: 'success' });
  } catch (err) {
    toast.add({
      summary: 'Error updating organization',
      detail: updateError.value?.response?.data.message ?? 'An unknown error occurred',
      severity: 'error',
    });
  }
};
</script>
