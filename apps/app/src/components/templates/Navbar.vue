<template>
  <nav class="w-full grid grid-cols-[1fr,_auto] gap-x-4 items-center bg-primary-800 border-b border-neutral-700 py-2 px-5 h-12">
    <div class="flex gap-x-4 items-center h-8">
      <slot></slot>
    </div>
    <div class="flex gap-x-4 items-center h-8">
      <Button
        icon="inbox"
        text
        severity="neutral"
        :badge="invites.length > 0 ? invites.length.toString() : undefined"
        badgeSeverity="info"
        @click="notificationMenu?.toggle($event)"
      ></Button>

      <OverlayPanel ref="notificationMenu" class="w-full max-w-80">
        <div class="px-4 py-3 bg-neutral-800 border-b border-neutral-700 w-full">
          <span class="text-neutral-200 text-body-small">Notifications</span>
        </div>
        <div class="divide-y divide-neutral-700">
          <template v-for="invite in invites" :key="invite.organizationId">
            <div class="px-4 py-5">
              <p class="text-body-small text-neutral-200">New invitation</p>
              <p class="text-body-small text-neutral-400 mt-1 mb-2">
                You have been invited to join the <span class="text-neutral-200">{{ invite.organizationName }}</span> organization!
              </p>
              <div class="flex justify-end gap-x-2">
                <Button
                  size="small"
                  label="Decline"
                  severity="neutral"
                  :loading="decliningInvite === invite.organizationId"
                  :disabled="decliningInvite === invite.organizationId"
                  loadingIcon="progress_activity"
                  @click="handleDeclineInvite(invite)"
                ></Button>

                <Button
                  size="small"
                  label="Accept"
                  :loading="acceptingInvite === invite.organizationId"
                  :disabled="acceptingInvite === invite.organizationId"
                  loadingIcon="progress_activity"
                  @click="handleAcceptInvite(invite)"
                ></Button>
              </div>
            </div>
          </template>
          <div v-if="invites.length === 0">
            <div class="px-4 py-5 text-body-small text-neutral-400">You have no notifications pending</div>
          </div>
        </div>
      </OverlayPanel>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAcceptInvite, useDeclineInvite, useInvites } from '@/composables/invite';
import { useToaster } from '@/composables/toaster';
import { ApiInvite } from '@/services/api/data-contracts';
import Button from 'primevue/button';
import OverlayPanel from 'primevue/overlaypanel';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const toaster = useToaster();
const notificationMenu = ref<OverlayPanel>();

const { data } = useInvites();

const invites = computed(() => data.value?.pages.flatMap(page => page.data) ?? []);

const acceptingInvite = ref<string | null>(null);
const { mutateAsync: acceptInvite, error: acceptError } = useAcceptInvite();
const handleAcceptInvite = async (invite: ApiInvite) => {
  try {
    acceptingInvite.value = invite.organizationId;
    await acceptInvite(invite.organizationId);
    toaster.add({
      summary: 'Invitation accepted',
      detail: `You have joined ${invite.organizationName}`,
      severity: 'success',
    });
    notificationMenu.value?.hide();
    await router.push('/platform/projects');
  } catch {
    toaster.add({
      summary: 'Error accepting invitation',
      detail: acceptError.value?.response?.data.message ?? 'An unknown error occurred',
      severity: 'error',
    });
  }

  acceptingInvite.value = null;
};

const decliningInvite = ref<string | null>(null);
const { mutateAsync: declineInvite, error: declineError } = useDeclineInvite();
const handleDeclineInvite = async (invite: ApiInvite) => {
  try {
    decliningInvite.value = invite.organizationId;
    await declineInvite(invite.organizationId);
    toaster.add({
      summary: 'Invitation declined',
      detail: `You have declined the invitation from ${invite.organizationName}`,
      severity: 'success',
    });
    notificationMenu.value?.hide();
    await router.push('/platform/projects');
  } catch {
    toaster.add({
      summary: 'Error declining invitation',
      detail: declineError.value?.response?.data.message ?? 'An unknown error occurred',
      severity: 'error',
    });
  }

  acceptingInvite.value = null;
};
</script>
