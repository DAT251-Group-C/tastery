<template>
  <div>
    <h3 class="text-body-large text-neutral-200 mt-12 mb-4">Members</h3>

    <div class="flex gap-x-3 items-center mb-3">
      <IconField iconPosition="left" class="max-w-48 w-full mr-auto">
        <InputIcon class="font-symbol">search</InputIcon>
        <InputText v-model="memberFilters['global'].value" placeholder="Filter members" />
      </IconField>
      <Button
        size="small"
        label="Leave team"
        severity="neutral"
        :loading="removeMembershipPending && removingMembership?.userId === membership?.userId"
        :disabled="!membership || membership.role === ApiMembershipRole.Owner"
        @click="handleLeaveOrganization()"
      ></Button>
    </div>

    <!-- Memberships -->
    <DataTable
      v-model:filters="memberFilters"
      :value="memberships"
      size="large"
      :loading="membershipsFetching"
      loadingIcon="progress_activity"
      :globalFilterFields="['user.name', 'user.email', 'role']"
      dataKey="id"
      class="rounded-xs overflow-hidden ring-1 ring-neutral-700"
    >
      <Column field="user.name" header="User">
        <template #body="{ data }">
          <div class="flex items-center gap-x-4">
            <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-body-large-bold">E</div>
            <div>
              <p class="text-body-small text-neutral-200">{{ data.user.name }}</p>
              <p class="text-body-small text-neutral-400">{{ data.user.email }}</p>
            </div>
          </div>
        </template>
      </Column>
      <Column field="role" header="Role">
        <template #body="{ data }">
          <Button
            icon="expand_more"
            class="w-[6.5rem] !text-left"
            iconPos="right"
            :label="data.role"
            :disabled="!membership || membership.role !== ApiMembershipRole.Owner || membership.userId === data.userId"
            severity="neutral"
            @click="onEditRole($event, data)"
          />
        </template>
      </Column>
      <Column field="context" class="text-right w-48">
        <template #body="{ data }: { data: ApiMembership }">
          <Button
            v-show="canRemoveMembership(data)"
            :disabled="removeMembershipPending && removingMembership?.userId === data.userId"
            :loading="removeMembershipPending && removingMembership?.userId === data.userId"
            loadingIcon="progress_activity"
            size="small"
            severity="neutral"
            label="Remove"
            @click="handleRemoveMembership(data.userId)"
          ></Button>
        </template>
      </Column>
      <template #empty>
        <div class="py-2.5">
          {{ membershipsFetching ? 'Fetching members...' : 'No members found by ' + memberFilters['global'].value }}
        </div>
      </template>
      <template v-if="!membershipsFetching" #footer>
        <div class="flex justify-between h-6 items-center">
          <p>{{ _memberships?.pages[0]?.meta.itemCount ?? '0' }} users</p>
          <Button v-if="membershipHasNext" size="small" severity="neutral" label="Load more" @click="fetchMoreMemberships()"></Button>
        </div>
      </template>
    </DataTable>

    <OverlayPanel ref="editRolePanel">
      <Menu :model="roleModel"></Menu>
    </OverlayPanel>

    <!-- Invites -->
    <h3 class="text-body-large text-neutral-200 mt-12 mb-4">Invites</h3>

    <div class="flex gap-x-3 items-center mb-3">
      <IconField iconPosition="left" class="max-w-48 w-full mr-auto">
        <InputIcon class="font-symbol">search</InputIcon>
        <InputText v-model="inviteFilters['global'].value" placeholder="Filter invites" />
      </IconField>
      <OrgnaizationInvite v-if="membership" :membership="membership" :organizationId="organizationId" />
    </div>
    <DataTable
      v-model:filters="inviteFilters"
      :value="invites"
      size="large"
      :loading="invitesFetching"
      loadingIcon="progress_activity"
      :globalFilterFields="['email', 'role']"
      dataKey="id"
      class="rounded-xs overflow-hidden ring-1 ring-neutral-700"
    >
      <Column field="email" header="Email">
        <template #body="{ data }">
          <div class="flex items-center gap-x-4">
            <i class="text-[2.5rem] large-symbol font-symbol text-neutral-500">account_circle</i>
            <div>
              <p class="text-body-small text-neutral-200">{{ data.email }}</p>
            </div>
          </div>
        </template>
      </Column>
      <Column field="status">
        <template #body="{ data }">
          <Tag v-if="data.expiresAt > new Date().toISOString()" severity="info" value="Pending" rounded />
          <Tag v-else severity="warning" value="Expired" rounded />
        </template>
      </Column>
      <Column field="role" header="Role">
        <template #body="{ data }">
          <div>
            <Button icon="expand_more" class="w-[6.5rem] !text-left" iconPos="right" :label="data.role" disabled severity="neutral" />
          </div>
        </template>
      </Column>
      <Column field="context" class="text-right w-48">
        <template #body="{ data }">
          <Button
            :disabled="inviteBeingRevoked === data.email"
            :loading="inviteBeingRevoked === data.email"
            loadingIcon="progress_activity"
            size="small"
            severity="neutral"
            label="Revoke"
            @click="onRevokeInvite(data)"
          ></Button>
        </template>
      </Column>
      <template #empty>
        <div class="py-2.5">
          {{
            invitesFetching
              ? 'Fetching invites...'
              : inviteFilters['global'].value
                ? 'No invites found by ' + inviteFilters['global'].value
                : 'No invites pending'
          }}
        </div>
      </template>
      <template v-if="!invitesFetching" #footer>
        <div class="flex justify-between h-6 items-center">
          <p>{{ _invites?.pages[0]?.meta.itemCount ?? '0' }} invites</p>
          <Button v-if="inviteHasNext" size="small" severity="neutral" label="Load more" @click="fetchMoreInvites()"></Button>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { useOrganizationInvites, useRevokeInvite } from '@/composables/invite';
import { useMembership, useOrganizationMemberships, useRemoveMembership, useUpdateMembershipRole } from '@/composables/membership';
import { useToaster } from '@/composables/toaster';
import { ApiInvite, ApiMembership, ApiMembershipRole } from '@/services/api/data-contracts';
import { FilterMatchMode } from 'primevue/api';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Menu from 'primevue/menu';
import { MenuItem } from 'primevue/menuitem';
import OverlayPanel from 'primevue/overlaypanel';
import Tag from 'primevue/tag';
import { useConfirm } from 'primevue/useconfirm';
import { computed, nextTick, ref } from 'vue';
import OrgnaizationInvite from './OrganizationInvite.vue';

const { organizationId } = defineProps<{ organizationId: string }>();
const { data: membership } = useMembership(organizationId);
const toaster = useToaster();

const {
  data: _memberships,
  isFetching: membershipsFetching,
  hasNextPage: membershipHasNext,
  fetchNextPage: fetchMoreMemberships,
} = useOrganizationMemberships(organizationId);
const memberships = computed(() => _memberships.value?.pages.flatMap(page => page.data) ?? []);
const memberFilters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const {
  data: _invites,
  isFetching: invitesFetching,
  hasNextPage: inviteHasNext,
  fetchNextPage: fetchMoreInvites,
} = useOrganizationInvites(organizationId);
const invites = computed(() => _invites.value?.pages.flatMap(page => page.data) ?? []);
const inviteFilters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const inviteBeingRevoked = ref<string | null>(null);
const { mutateAsync: revokeInvite, error: revokeError } = useRevokeInvite();

const onRevokeInvite = async (invite: ApiInvite) => {
  try {
    inviteBeingRevoked.value = invite.email;
    await revokeInvite(invite);
    toaster.add({ summary: 'Invite revoked', detail: 'The invite has been revoked', severity: 'success' });
  } catch {
    toaster.add({
      summary: 'Error revoking invite',
      detail: revokeError.value?.response?.data.message ?? 'An unknown error occurred',
      severity: 'error',
    });
  }
  inviteBeingRevoked.value = null;
};

const {
  mutateAsync: removeMembership,
  isPending: removeMembershipPending,
  error: removeMembershipError,
  variables: removingMembership,
} = useRemoveMembership();

const handleRemoveMembership = async (userId: string) => {
  try {
    await removeMembership({ organizationId, userId });
    toaster.add({ summary: 'Member removed', detail: 'The member has been removed', severity: 'success' });
  } catch (error) {
    toaster.add({
      summary: 'Error removing member',
      detail: removeMembershipError.value?.response?.data.message ?? 'An unknown error occurred',
      severity: 'error',
    });
  }
};

const canRemoveMembership = (removeMember: ApiMembership) => {
  const self = membership.value;

  if (!self) {
    return false;
  }

  if (self.userId === removeMember.userId) {
    return false;
  }

  if (self.role === ApiMembershipRole.User) {
    return false;
  }

  if (self.role === ApiMembershipRole.Admin && removeMember.role === ApiMembershipRole.Owner) {
    return false;
  }

  return true;
};

const handleLeaveOrganization = async () => {
  if (!membership.value) {
    return;
  }

  try {
    await removeMembership({ organizationId, userId: membership.value?.userId });
    toaster.add({ summary: 'Left organization', detail: 'You have left the organization', severity: 'success' });
  } catch {
    toaster.add({
      summary: 'Error leaving organization',
      detail: removeMembershipError.value?.response?.data.message ?? 'An unknown error occurred',
      severity: 'error',
    });
  }
};

const editRolePanel = ref<OverlayPanel>();
const editingRole = ref<ApiMembership | null>(null);
const roleModel = computed<MenuItem[]>(() => {
  const role = membership.value?.role;
  const editRole = editingRole.value?.role;

  if (!role || !editRole) {
    return [];
  }

  const options: ApiMembershipRole[] = [ApiMembershipRole.Owner];

  if (editRole !== ApiMembershipRole.Admin) {
    options.push(ApiMembershipRole.Admin);
  }

  if (editRole !== ApiMembershipRole.User) {
    options.push(ApiMembershipRole.User);
  }

  return options.map(role => ({
    label: role,
    command: () => handleUpdateRole(role),
  }));
});

const onEditRole = (event: Event, membership: ApiMembership) => {
  const panel = editRolePanel.value;
  if (!panel) {
    return;
  }

  panel.show(event);
  editingRole.value = membership;

  nextTick(() => {
    panel.alignOverlay();
  });
};

const confirm = useConfirm();
const { mutateAsync: updateMembershipRole, error: updateMemebershipRoleError } = useUpdateMembershipRole();
const handleUpdateRole = async (role: ApiMembershipRole) => {
  const editingMembership = editingRole.value;

  if (!editingMembership) {
    return;
  }

  if (role === ApiMembershipRole.Owner) {
    confirm.require({
      header: 'Transfer ownership of the organization',
      acceptLabel: 'Transfer ownership',
      rejectLabel: 'Cancel',
      message: 'Are you sure you want to transfer ownership?',
      accept: async () => {
        try {
          await updateMembershipRole({ organizationId, userId: editingMembership.userId, role });
          toaster.add({ summary: 'Ownership transfered', detail: 'Your role has been updated to admin', severity: 'success' });
        } catch {
          toaster.add({
            summary: 'Error transfering ownership',
            detail: updateMemebershipRoleError.value?.response?.data.message ?? 'An unknown error occurred',
            severity: 'error',
          });
        }
      },
    });
  } else {
    try {
      await updateMembershipRole({ organizationId, userId: editingMembership.userId, role });
      toaster.add({ summary: 'Role updated', detail: 'The role has been updated', severity: 'success' });
    } catch {
      toaster.add({
        summary: 'Error updating role',
        detail: updateMemebershipRoleError.value?.response?.data.message ?? 'An unknown error occurred',
        severity: 'error',
      });
    }
  }
};
</script>
