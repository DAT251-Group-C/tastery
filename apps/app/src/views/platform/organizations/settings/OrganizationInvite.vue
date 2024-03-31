<template>
  <Button :disabled="membership.role === ApiMembershipRole.User" size="small" label="Invite" @click="inviteDialogVisible = true"></Button>

  <Dialog
    v-model:visible="inviteDialogVisible"
    maximizable
    modal
    header="Invite to organization"
    :style="{ maxWidth: '32rem' }"
    closeOnEscape
    dismissableMask
  >
    <form id="invite_form" @submit.prevent="handleInvite">
      <Control label="Member role" class="mb-1">
        <Dropdown v-model="role" :options="roles" :disabled="!hasAdminOrOwnerRole" size="large"></Dropdown>
      </Control>

      <Control label="Email address" class="mb-1">
        <InputText v-model="email" type="email" required placeholder="Enter email address" size="large" />
      </Control>
    </form>

    <template #footer>
      <Button
        type="submit"
        form="invite_form"
        class="w-full"
        label="Invite new member"
        loadingIcon="progress_activity"
        :disabled="isPending"
        :loading="isPending"
      ></Button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Control from '@/components/atoms/Control.vue';
import { useCreateInvite } from '@/composables/invite';
import { useToaster } from '@/composables/toaster';
import { ApiFullMembership, ApiMembershipRole } from '@/services/api/data-contracts';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import { computed, ref, toRefs } from 'vue';

const props = defineProps<{ membership: ApiFullMembership; organizationId: string }>();
const { membership, organizationId } = toRefs(props);
const toaster = useToaster();

const hasAdminOrOwnerRole = computed(() => {
  if (!membership.value) {
    return false;
  }

  return [ApiMembershipRole.Owner, ApiMembershipRole.Admin].includes(membership.value.role);
});

const { mutateAsync: createInvite, error, isPending } = useCreateInvite();
const inviteDialogVisible = ref(false);
const email = ref('');
const role = ref(ApiMembershipRole.User);
const roles = [ApiMembershipRole.Admin, ApiMembershipRole.User];

const handleInvite = async () => {
  try {
    await createInvite({ email: email.value, role: role.value, organizationId: organizationId.value });
    toaster.add({ summary: 'Invite sent', detail: 'The invite has been sent', severity: 'success' });
    inviteDialogVisible.value = false;
    email.value = '';
    role.value = ApiMembershipRole.User;
  } catch {
    toaster.add({
      summary: 'Error sending invite',
      detail: error.value?.response?.data.message ?? 'An unknown error occurred',
      severity: 'error',
    });
  }
};
</script>
