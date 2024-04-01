<template>
  <Navbar>
    <Logo />
    <p class="text-body-small">Create an organization</p>
    <i class="font-symbol text-body text-neutral-400">chevron_right</i>
    <p class="text-body-small text-neutral-400">Create a new project</p>
    <i class="font-symbol text-body text-neutral-400">chevron_right</i>
    <p class="text-body-small text-neutral-400">Get started</p>
  </Navbar>
  <div class="view max-w-3xl">
    <form class="flex flex-col gap-y-4 bg-neutral-800 ring-1 ring-neutral-700 px-6 py-4 rounded-sm" @submit.prevent="submit()">
      <h1 class="text-body text-neutral-200">Create a new organization</h1>
      <hr class="border-neutral-700 -mx-6" />

      <div v-if="error" class="bg-error-dark ring-1 ring-error rounded-xs p-4">
        <p class="text-body-small text-neutral-200">Error creating organization</p>
        <p class="text-caption text-neutral-400">{{ error.response?.data?.message }}</p>
      </div>

      <div class="mb-4">
        <p class="text-body-small text-neutral-200">This is your organization within Agient.</p>
        <p class="text-body-small text-neutral-400">For example, you can use the name of your company or department.</p>
      </div>

      <div class="grid grid-cols-3">
        <span class="text-body-small text-neutral-400">Name</span>
        <Control hideLabel class="col-span-2" hint="What's the name of your company or team?">
          <InputText v-model="name" size="large" placeholder="Organization name"></InputText>
        </Control>
      </div>

      <hr class="border-neutral-700 -mx-6" />
      <div class="flex items-center gap-x-2">
        <RouterLink to="/platform" tabindex="-1">
          <Button size="small" label="Cancel" severity="neutral"></Button>
        </RouterLink>
        <p class="text-caption text-neutral-400 ml-auto mr-2">You can rename your organization later</p>
        <Button type="submit" size="small" loadingIcon="progress_activity" :loading="isPending" label="Create organization"></Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import Control from '@/components/atoms/Control.vue';
import Logo from '@/components/atoms/Logo.vue';
import Navbar from '@/components/templates/Navbar.vue';
import { useCreateOrganization } from '@/composables/organization';
import { useQueryClient } from '@tanstack/vue-query';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { isPending, error, mutate } = useCreateOrganization();
const queryClient = useQueryClient();

const name = ref('');

const submit = () => {
  mutate(
    { name: name.value },
    {
      onSuccess: data => {
        queryClient.invalidateQueries({ predicate: query => query.queryKey.includes('organizations') });
        router.push({ name: 'Create project', query: { organizationId: data.id } });
      },
    },
  );
};
</script>
