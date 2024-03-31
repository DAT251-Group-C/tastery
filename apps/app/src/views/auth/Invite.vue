<template>
  <!-- Errpr -->
  <Auth v-if="isError">
    <template v-if="isExpired">
      <h1 class="mt-8 text-neutral-100 mb-4">Invite expired</h1>
      <p class="text-body-small text-neutral-400 mb-10">
        The invitation has expired. Please ask an organization administrator to send you a new one.
      </p>
    </template>

    <template v-else-if="isNotFound">
      <h1 class="mt-8 text-neutral-100 mb-4">Invite not found</h1>
      <p class="text-body-small text-neutral-400 mb-10">
        The invitation could not be found. Please ask an organization administrator to send you a new one.
      </p>
    </template>

    <template v-else>
      <h1 class="mt-8 text-neutral-100 mb-4">An error occurred</h1>
      <p class="text-body-small text-neutral-400 mb-10">An error occurred when trying to find the invite. Please try again later.</p>
    </template>

    <RouterLink v-if="isAuthenticated" :to="{ name: 'Projects' }" tabindex="-1">
      <Button :label="'Go to dashboard'" size="large" class="w-full"></Button>
    </RouterLink>
    <RouterLink v-else :to="{ name: 'Sign in' }" tabindex="-1">
      <Button :label="'Sign in'" size="large" class="w-full"></Button>
    </RouterLink>
  </Auth>

  <!-- Loading -->
  <Auth v-else-if="!isChecked || isPending || !invite">
    <div class="flex justify-center">
      <i class="font-symbol text-[3rem] large-symbol animate-spin">progress_activity</i>
    </div>
  </Auth>

  <Auth v-else>
    <h1 class="mt-8 mb-2 text-neutral-100">You have been invited</h1>
    <p class="text-body-small text-neutral-400 mb-4">
      You have been invited to join <span class="text-neutral-200">{{ invite.organizationName }}</span>
    </p>
    <div v-if="isSameEmail">
      <p class="text-body-small text-neutral-400 mb-10">
        To accept, you must log in with using your <span class="text-neutral-200">{{ invite.email }}</span> email
      </p>
      <Button
        :label="'Accept invitation'"
        :loading="acceptPending"
        loadingIcon="progress_activity"
        size="large"
        class="w-full"
        @click="handleAcceptInvite(invite)"
      ></Button>
      <Button
        :label="'Decline'"
        :loading="declinePending"
        loadingIcon="progress_activity"
        severity="neutral"
        size="large"
        class="w-full mt-5"
        @click="handleDeclineInvite(invite)"
      ></Button>
    </div>
    <form v-else-if="!isAuthenticated" class="flex flex-col gap-y-5">
      <p class="text-body-small text-neutral-400 mb-10">
        To accept, you must log in with using your <span class="text-neutral-200">{{ invite?.email }}</span> email
      </p>
      <Button severity="neutral" :label="'Continue with Github'" size="large" @click="signInWithGithub()"></Button>
      <Button severity="neutral" :label="'Continue with Google'" size="large"></Button>
      <Divider><span class="bg-neutral-800 text-neutral-300 px-2">or</span></Divider>
      <RouterLink :to="{ name: 'Sign in', query: { email: invite.email } }" tabindex="-1">
        <Button :label="'Log in'" size="large" class="w-full"></Button>
      </RouterLink>
      <div class="text-caption text-neutral-400 mt-1">
        <p class="flex justify-center items-center">
          Don't have an account?
          <RouterLink :to="{ name: 'Sign up', query: { email: invite.email } }" tabindex="-1">
            <Button link class="!text-caption !px-1" label="Sign up now"></Button>
          </RouterLink>
        </p>
      </div>
    </form>
    <div v-else>
      <p class="text-body-small text-neutral-400 mb-4">
        You are currently logged in with <span class="text-neutral-200">{{ currentSession?.user.email }}</span
        >, but the invitation is for <span class="text-neutral-200">{{ invite.email }}</span
        >.
      </p>
      <p class="text-body-small text-neutral-400 mb-10">Please sign back in with the correct email.</p>
      <Button :label="'Sign out'" size="large" class="w-full" @click="signOut()"></Button>
      <RouterLink :to="{ name: 'Projects' }" tabindex="-1">
        <Button :label="'Go to dashboard'" severity="neutral" size="large" class="w-full mt-5"></Button>
      </RouterLink>
    </div>
  </Auth>
</template>

<script setup lang="ts">
import { useAcceptInvite, useDeclineInvite, useInviteByHash } from '@/composables/invite';
import { useToaster } from '@/composables/toaster';
import { signOut, supabase } from '@/plugins/supabase';
import { ApiInvite } from '@/services/api/data-contracts';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import { computed, onMounted, ref, toRefs, watch } from 'vue';
import { useRouter } from 'vue-router';
import Auth from './Auth.vue';

const authStore = useAuthStore();
const router = useRouter();
const toaster = useToaster();
const isChecked = ref(false);
const isSameEmail = ref(false);

const props = defineProps<{ hash: string }>();
const { hash } = toRefs(props);
const { data: invite, isError, isPending, error } = useInviteByHash(hash);
const { initialized, isAuthenticated, currentSession } = storeToRefs(authStore);

const isExpired = computed(() => {
  if (!error) {
    return false;
  }

  return error.value?.response?.data.message === 'Invite has expired';
});

const isNotFound = computed(() => {
  if (!error) {
    return false;
  }

  return error.value?.response?.status === 404;
});

const init = () => {
  if (invite.value && initialized.value) {
    isChecked.value = true;

    if (!currentSession.value || invite.value.email !== currentSession.value.user.email) {
      authStore.saveRedirectRoute({ name: 'Invite', query: { hash: hash.value } });
    } else {
      isSameEmail.value = invite.value.email === currentSession.value.user.email;

      if (isSameEmail.value) {
        authStore.clearRedirectRoute();
      }
    }
  }
};

watch(() => invite.value && initialized.value, init);
onMounted(init);

const signInWithGithub = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'github',
  });
};

const { mutateAsync: declineInvite, isPending: declinePending, error: declineError } = useDeclineInvite();
const handleDeclineInvite = async (invite: ApiInvite) => {
  try {
    await declineInvite(invite.email);
    toaster.add({
      severity: 'success',
      summary: 'Invite declined',
      detail: 'You have declined the invitation from ' + invite.organizationName,
      life: 5000,
    });
    router.push({ name: 'Projects' });
  } catch (error) {
    toaster.add({
      severity: 'error',
      summary: 'Error declining invite',
      detail: declineError.value?.response?.data.message ?? 'An error occurred',
      life: 5000,
    });
  }
};

const { mutateAsync: acceptInvite, isPending: acceptPending, error: acceptError } = useAcceptInvite();
const handleAcceptInvite = async (invite: ApiInvite) => {
  try {
    await acceptInvite(invite.organizationId);
    toaster.add({
      severity: 'success',
      summary: 'Invite accepted',
      detail: 'You have accepted the invitation from ' + invite.organizationName,
      life: 5000,
    });
    router.push({ name: 'Projects' });
  } catch (error) {
    toaster.add({
      severity: 'error',
      summary: 'Error accepting invite',
      detail: acceptError.value?.response?.data.message ?? 'An error occurred',
      life: 5000,
    });
  }
};
</script>
