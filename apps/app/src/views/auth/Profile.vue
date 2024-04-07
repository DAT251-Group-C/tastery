<template>
  <Navbar></Navbar>
  <div class="view">
    <h2>Your profile</h2>
    <div v-if="userLoading" class="text-center my-16">
      <p v-debounce class="text-body-small text-neutral-600">Loading profile...</p>
    </div>
    <div v-else-if="user" class="flex flex-col gap-y-4 mt-8 rounded-sm ring-1 p-6 ring-neutral-300">
      <div class="grid md:grid-cols-3 gap-4 mb-2">
        <span class="text-body-small text-neutral-400">Email</span>
        <Control hideLabel class="col-span-2" hideDetails>
          <InputText v-model="user.email" size="large" readonly disabled class="w-full"></InputText>
        </Control>
      </div>

      <div class="grid md:grid-cols-3 gap-4 mb-2">
        <span class="text-body-small text-neutral-400">Name</span>
        <Control hideLabel class="col-span-2" hideDetails>
          <InputText v-model="name" size="large" :disabled="isPending" class="w-full"></InputText>
        </Control>
      </div>

      <Button
        label="Save"
        :disabled="isPending"
        :loading="isPending"
        loadingIcon="progress_activity"
        class="self-end"
        @click="save()"
      ></Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Navbar from '@/components/templates/Navbar.vue';
import { useToaster } from '@/composables/toaster';
import { useUpdateUser, useUser } from '@/composables/user';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { onMounted, ref, watch } from 'vue';

const name = ref('');

const toaster = useToaster();
const { data: user, isLoading: userLoading } = useUser();
const { mutateAsync: updateUser, error: updateError, isPending } = useUpdateUser();

watch(user, value => {
  if (value) {
    name.value = value.name;
  }
});

onMounted(() => {
  if (user.value) {
    name.value = user.value.name;
  }
});

const save = async () => {
  try {
    await updateUser({ name: name.value });
    toaster.add({ severity: 'success', summary: 'Profile updated' });
  } catch {
    toaster.add({
      severity: 'error',
      summary: 'Profile update failed',
      detail: updateError.value?.response?.data.message ?? 'An error occurred',
    });
  }
};
</script>
