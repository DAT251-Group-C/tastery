<template>
  <div>
    <h3 class="text-body-large text-neutral-200 mt-12 mb-4">Members</h3>

    <div class="flex gap-x-3 items-center mb-3">
      <IconField iconPosition="left" class="max-w-48 w-full mr-auto">
        <InputIcon class="font-symbol">search</InputIcon>
        <InputText v-model="memberFilters['global'].value" placeholder="Filter members" />
      </IconField>
      <Button size="small" label="Leave team" severity="neutral"></Button>
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
          <Dropdown v-model="data.role" :options="roles" size="large"></Dropdown>
        </template>
      </Column>
      <template #empty>
        <div class="py-2.5">No members found</div>
      </template>
      <template v-if="!membershipsFetching" #footer>
        <div class="flex justify-between h-6 items-center">
          <p>{{ _memberships?.pages[0]?.meta.itemCount ?? '0' }} users</p>
          <Button v-if="membershipHasNext" size="small" severity="neutral" label="Load more" @click="fetchMoreMemberships()"></Button>
        </div>
      </template>
    </DataTable>

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
          <Tag v-if="data.expiresAt < new Date().toISOString()" severity="info" value="Pending" rounded />
          <Tag v-else severity="warning" value="Expired" rounded />
        </template>
      </Column>
      <Column field="role" header="Role">
        <template #body="{ data }">
          <Dropdown v-model="data.role" :options="roles" disabled size="large"></Dropdown>
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
        <div class="py-2.5">{{ invitesFetching ? 'Fetching invites...' : 'No invites pending' }}</div>
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
import { useMembership, useOrganizationMemberships } from '@/composables/membership';
import { useToaster } from '@/composables/toaster';
import { ApiInvite, ApiMembershipRole } from '@/services/api/data-contracts';
import { FilterMatchMode } from 'primevue/api';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dropdown from 'primevue/dropdown';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import { computed, ref } from 'vue';
import OrgnaizationInvite from './OrganizationInvite.vue';

const roles = Object.values(ApiMembershipRole);
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
</script>
