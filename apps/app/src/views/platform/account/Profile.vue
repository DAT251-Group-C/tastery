<template>
  <div class="platform-view max-w-4xl">
    <div class="flex flex-col gap-y-4 bg-neutral-800 ring-1 ring-neutral-700 px-6 py-4 rounded-sm">
      <h1 class="text-body text-neutral-200 mb-4">Account information</h1>

      <div class="grid grid-cols-3">
        <span class="text-body-small text-neutral-400">Email</span>
        <Control size="large" hideLabel class="col-span-2" hideDetails>
          <InputText v-model="email" size="large" disabled readonly></InputText>
        </Control>
      </div>
    </div>

    <form class="flex flex-col gap-y-4 bg-neutral-800 ring-1 ring-neutral-700 px-6 py-4 rounded-sm" @submit.prevent="submit()">
      <h1 class="text-body text-neutral-200 mb-4">Profile information</h1>

      <div class="grid grid-cols-3">
        <span class="text-body-small text-neutral-400">Name</span>
        <Control size="large" hideLabel class="col-span-2" hideDetails>
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
  </div>
</template>

<script setup lang="ts">
import Control from '@/components/atoms/Control.vue';
import { useToaster } from '@/composables/toaster';
import { useUpdateUser, useUser } from '@/composables/user';
import { ApiUser } from '@/services/api/data-contracts';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { ref, watch } from 'vue';

const { data: user, isLoading } = useUser();
const { mutateAsync: updateUser, isPending, error: updateError } = useUpdateUser();
const toast = useToaster();

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
</script>
