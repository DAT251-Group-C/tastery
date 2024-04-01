<template>
  <form class="flex flex-col bg-neutral-800 ring-1 ring-neutral-700 rounded-sm" @submit.prevent="handleUpdateOrganization()">
    <div class="grid grid-cols-3 p-8">
      <span class="text-body-small text-neutral-200">General settings</span>
      <Control label="Organization name" class="col-span-2" hideDetails>
        <InputText v-model="name" size="large"></InputText>
      </Control>
    </div>

    <hr class="border-neutral-700" />

    <div class="flex items-center justify-end gap-x-2 px-8 py-4">
      <RouterLink to="/platform" tabindex="-1">
        <Button size="small" label="Cancel" severity="neutral"></Button>
      </RouterLink>
      <Button
        :disabled="organization?.name === name || updatePending"
        :loading="updatePending"
        type="submit"
        size="small"
        loadingIcon="progress_activity"
        label="Save"
      ></Button>
    </div>
  </form>

  <div
    v-if="membership && membership.role === ApiMembershipRole.Owner"
    class="flex flex-col bg-neutral-800 ring-1 ring-neutral-700 rounded-sm"
  >
    <div class="p-8">
      <span class="text-body text-neutral-200">DANGER ZONE</span>

      <div class="flex rounded-xs ring-1 ring-error mt-8 bg-error-dark p-4">
        <i class="shrink-0 mr-4 font-symbol text-error">warning</i>
        <div>
          <p class="text-body-small text-neutral-200">Deleting this organization will also remove its projects</p>
          <p class="text-body-small text-neutral-400 mt-1 mb-4">Any chatbots using this project will no longer work.</p>
          <Button severity="error" outlined size="small" label="Delete organization" @click="deleteDialogVisible = true"></Button>
        </div>
      </div>
    </div>
  </div>

  <Dialog
    v-model:visible="deleteDialogVisible"
    maximizable
    modal
    header="Delete organization"
    :style="{ maxWidth: '25rem' }"
    closeOnEscape
    dismissableMask
  >
    <p class="text-neutral-400">
      This action <span class="text-neutral-200">cannot</span> be undone. This will permanently delete the
      <span class="text-neutral-200">{{ organization.name }}</span> organization and remove all of its projects.
    </p>

    <hr class="border-neutral-700 my-4 -mx-5" />

    <p class="text-neutral-400 mb-2">
      Please type <span class="text-neutral-200">{{ organization.name }}</span> to confirm
    </p>
    <Control hideLabel hideDetails class="mb-1">
      <InputText v-model="confirmDelete" placeholder="Enter the string above" size="large" />
    </Control>

    <template #footer>
      <Button
        class="w-full"
        label="I understand, delete this organization"
        outlined
        :disabled="confirmDelete !== organization.name"
        :loading="deletePending"
        loadingIcon="progress_activity"
        severity="error"
        @click="handleDeleteOrganization()"
      ></Button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Control from '@/components/atoms/Control.vue';
import { useMembership } from '@/composables/membership';
import { useDeleteOrganization, useUpdateOrganization } from '@/composables/organization';
import { useToaster } from '@/composables/toaster';
import { ApiFullOrganization, ApiMembershipRole } from '@/services/api/data-contracts';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const { organization } = defineProps<{ organization: ApiFullOrganization }>();
const toaster = useToaster();
const router = useRouter();
const name = ref(organization.name);
const { data: membership } = useMembership(organization.id);

const { mutateAsync: updateOrganization, isPending: updatePending, error: updateError } = useUpdateOrganization();
const handleUpdateOrganization = async () => {
  try {
    await updateOrganization({ name: name.value, organizationId: organization.id });
    toaster.add({ summary: 'Organization updated', detail: 'Your changes have been saved', severity: 'success' });
  } catch (err) {
    toaster.add({
      summary: 'Error updating organization',
      detail: updateError.value?.response?.data.message ?? 'An unknown error occurred',
      severity: 'error',
    });
  }
};

const deleteDialogVisible = ref(false);
const confirmDelete = ref('');
const { mutateAsync: deleteOrganization, isPending: deletePending, error: deleteError } = useDeleteOrganization();
const handleDeleteOrganization = async () => {
  try {
    await deleteOrganization(organization.id);
    deleteDialogVisible.value = false;
    toaster.add({ severity: 'success', summary: 'Organization deleted', detail: 'The organization has been deleted', life: 3000 });
    router.push({ name: 'Projects' });
  } catch (err) {
    deleteDialogVisible.value = false;
    toaster.add({
      summary: 'Error deleting organization',
      detail: deleteError.value?.response?.data.message ?? 'An unknown error occurred',
      severity: 'error',
    });
  }
};
</script>
