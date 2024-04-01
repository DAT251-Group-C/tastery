<template>
  <div class="platform-view max-w-4xl">
    <Skeleton v-if="isFetching" class="w-full h-[128px] ring-1 ring-neutral-700 rounded-sm"></Skeleton>
    <div v-else class="flex flex-col gap-y-4 bg-neutral-800 ring-1 ring-neutral-700 px-6 py-4 rounded-sm">
      <h1 class="text-body text-neutral-200 mb-4">Account information</h1>

      <div class="grid md:grid-cols-3 gap-4 mb-2">
        <span class="text-body-small text-neutral-400">Email</span>
        <Control hideLabel class="col-span-2" hideDetails>
          <InputText v-model="email" type="email" size="large" disabled readonly></InputText>
        </Control>
      </div>
    </div>

    <Skeleton v-if="isFetching" class="w-full h-[185px] ring-1 ring-neutral-700 rounded-sm"></Skeleton>
    <form v-else class="flex flex-col gap-y-4 bg-neutral-800 ring-1 ring-neutral-700 px-6 py-4 rounded-sm" @submit.prevent="submit()">
      <h1 class="text-body text-neutral-200 mb-4">Profile information</h1>

      <div class="grid md:grid-cols-3 gap-4 mb-2">
        <span class="text-body-small text-neutral-400">Name</span>
        <Control hideLabel class="col-span-2" hideDetails>
          <InputText v-model="name" size="large" :disabled="isPending"></InputText>
        </Control>
      </div>

      <hr class="border-neutral-700 -mx-6" />
      <div class="flex items-center justify-end gap-x-2">
        <RouterLink to="/platform" tabindex="-1">
          <Button size="small" label="Cancel" severity="neutral"></Button>
        </RouterLink>
        <Button
          :disabled="isLoading || user?.name === name || isPending"
          :loading="isPending"
          type="submit"
          size="small"
          loadingIcon="progress_activity"
          label="Save"
        ></Button>
      </div>
    </form>

    <div :class="[{ 'animate-highlight': passwordRecovery === 'true' }, 'rounded-sm']">
      <form
        v-if="canResetPassword"
        class="flex flex-col gap-y-4 bg-neutral-800 ring-1 ring-neutral-700 px-6 py-4 rounded-sm"
        @submit.prevent="updatePassword()"
      >
        <h1 class="text-body text-neutral-200 mb-4">Password</h1>

        <div class="grid md:grid-cols-3 gap-4 mb-2">
          <span class="text-body-small text-neutral-400">Change password</span>
          <Control hideLabel class="col-span-2">
            <InputText v-model="password1" size="large" placeholder="New password" type="password" minlength="8" required></InputText>
          </Control>
          <div></div>
          <Control hideLabel class="col-span-2" hideDetails>
            <InputText v-model="password2" size="large" placeholder="Confirm password" type="password" minlength="8" required></InputText>
          </Control>
        </div>

        <hr class="border-neutral-700 -mx-6" />
        <div class="flex items-center justify-end gap-x-2">
          <RouterLink to="/platform" tabindex="-1">
            <Button size="small" label="Cancel" severity="neutral"></Button>
          </RouterLink>
          <Button
            :disabled="updatingPassword || password1 !== password2 || !password1.length"
            :loading="updatingPassword"
            type="submit"
            size="small"
            loadingIcon="progress_activity"
            label="Save"
          ></Button>
        </div>
      </form>
    </div>

    <Skeleton v-if="isFetching" class="w-full h-[185px] ring-1 ring-neutral-700 rounded-sm"></Skeleton>
    <form v-else class="flex flex-col gap-y-4 bg-neutral-800 ring-1 ring-neutral-700 px-6 py-4 rounded-sm" @submit.prevent="submit()">
      <h1 class="text-body text-neutral-200 mb-4">Theme</h1>

      <div class="grid md:grid-cols-3 gap-4 mb-2">
        <span class="text-body-small text-neutral-400">Interface theme</span>
        <Control hideLabel class="col-span-2 lg:col-span-1" hint="Choose a theme preference">
          <Dropdown
            :modelValue="colorMode"
            :options="colorModes"
            optionLabel="label"
            size="large"
            optionValue="value"
            @update:model-value="mode = $event"
          />
        </Control>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import Control from '@/components/atoms/Control.vue';
import Skeleton from '@/components/atoms/Skeleton.vue';
import { useToaster } from '@/composables/toaster';
import { useUpdateUser, useUser } from '@/composables/user';
import { supabase } from '@/plugins/supabase';
import { ApiUser } from '@/services/api/data-contracts';
import { useAuthStore } from '@/stores/auth';
import { useColorMode } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import { computed, ref, watch } from 'vue';

const authStore = useAuthStore();
const { currentSession } = storeToRefs(authStore);
const canResetPassword = computed(() => !currentSession.value?.provider_token);
const { passwordRecovery } = defineProps<{ passwordRecovery?: string }>();
const { data: user, isLoading, isFetching } = useUser();
const { mutateAsync: updateUser, isPending, error: updateError } = useUpdateUser();
const toast = useToaster();
const mode = useColorMode();
const { store: colorMode } = mode;

const colorModes = [
  { label: 'System', value: 'auto' },
  { label: 'Dark', value: 'dark' },
  { label: 'Light', value: 'light' },
];

const submit = async () => {
  try {
    await updateUser({ name: name.value });
    toast.add({ summary: 'Profile updated', detail: 'Your profile has been updated', severity: 'success' });
  } catch (err) {
    toast.add({
      summary: 'Error updating profile',
      detail: updateError.value?.response?.data.message ?? 'An unknown error occurred',
      severity: 'error',
    });
  }
};

watch(
  () => user.value,
  () => {
    if (user.value) {
      updateModels(user.value);
    }
  },
);

const email = ref('');
const name = ref('');

const updateModels = (user: ApiUser) => {
  email.value = user.email;
  name.value = user.name;
};

if (user.value) {
  updateModels(user.value);
}

const updatingPassword = ref(false);
const password1 = ref('');
const password2 = ref('');
const updatePassword = async () => {
  if (password1.value !== password2.value || password1.value.length < 8) {
    return;
  }

  updatingPassword.value = true;
  try {
    await supabase.auth.updateUser({ password: password1.value });
    toast.add({ summary: 'Password updated', detail: 'Your password has been updated', severity: 'success' });
    password1.value = '';
    password2.value = '';
  } catch (err) {
    toast.add({
      summary: 'Error updating password',
      detail: (err as Error).message ?? 'An error occurred',
      severity: 'error',
    });
  }
  updatingPassword.value = false;
};
</script>
