<template>
  <Navbar>
    <Logo />
    <p class="text-body-small">Create an organization</p>
    <i class="font-symbol text-body">chevron_right</i>
    <p class="text-body-small">Create a new project</p>
    <i class="font-symbol text-body text-neutral-400">chevron_right</i>
    <p class="text-body-small text-neutral-400">Get started</p>
  </Navbar>
  <div class="view max-w-3xl">
    <form class="flex flex-col gap-y-4 bg-neutral-800 ring-1 ring-neutral-700 px-6 py-4 rounded-sm" @submit.prevent="submit()">
      <h1 class="text-body text-neutral-200">Create a new project</h1>
      <hr class="border-neutral-700 -mx-6" />

      <div v-if="error" class="bg-error-dark ring-1 ring-error rounded-xs p-4">
        <p class="text-body-small text-neutral-200">Error creating project</p>
        <p class="text-caption text-neutral-400">{{ error.response?.data?.message }}</p>
      </div>

      <div class="mb-4">
        <p class="text-body-small text-neutral-400">Your project will have a dedicated chatbot with it's own tools and configuration.</p>
        <p class="text-body-small text-neutral-400">It can easily be embedded to any website using our CDN or NPM package</p>
      </div>

      <div class="grid grid-cols-3">
        <span class="text-body-small text-neutral-400">Organization</span>
        <Control hideLabel class="col-span-2">
          <Dropdown
            v-model="selectedOrganizationId"
            :options="organizations"
            :loading="isFetching"
            :disabled="isFetching"
            :invalid="orgInvalid"
            placeholder="Choose organization"
            optionLabel="name"
            size="large"
            optionValue="id"
            loadingIcon="progress_activity"
          ></Dropdown>
        </Control>
      </div>

      <div class="grid grid-cols-3">
        <span class="text-body-small text-neutral-400">Name</span>
        <Control hideLabel class="col-span-2">
          <InputText v-model="name" size="large" placeholder="Project name" required></InputText>
        </Control>
      </div>

      <div class="grid grid-cols-3">
        <span class="text-body-small text-neutral-400">Description</span>
        <Control hideLabel class="col-span-2">
          <InputText v-model="description" size="large" placeholder="Project description" required></InputText>
        </Control>
      </div>

      <hr class="border-neutral-700 -mx-6" />
      <div class="flex items-center gap-x-2">
        <RouterLink to="/platform" tabindex="-1">
          <Button size="small" label="Cancel" severity="neutral"></Button>
        </RouterLink>
        <p class="text-caption text-neutral-400 ml-auto mr-2">You can rename your project later</p>
        <Button type="submit" size="small" loadingIcon="progress_activity" :loading="isPending" label="Create project"></Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import Control from '@/components/atoms/Control.vue';
import Logo from '@/components/atoms/Logo.vue';
import Navbar from '@/components/templates/Navbar.vue';
import { useOrganizations } from '@/composables/organization';
import { useCreateProject } from '@/composables/project';
import { useQueryClient } from '@tanstack/vue-query';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { isPending, error, mutate } = useCreateProject();
const { organizations, isFetching } = useOrganizations();

const name = ref('');
const description = ref('');
const selectedOrganizationId = ref<string | null>(null);
const submitted = ref(false);
const orgInvalid = computed(() => submitted.value && selectedOrganizationId.value === null);
const queryClient = useQueryClient();

onMounted(() => {
  const orgFromQuery = router.currentRoute.value.query.organizationId;
  if (orgFromQuery && typeof orgFromQuery === 'string' && orgFromQuery !== 'null') {
    selectedOrganizationId.value = orgFromQuery;
  }
});

const submit = () => {
  submitted.value = true;

  if (!selectedOrganizationId.value) {
    return;
  }

  mutate(
    { organizationId: selectedOrganizationId.value, name: name.value, description: description.value },
    {
      onSuccess: async data => {
        queryClient.invalidateQueries({
          predicate: ({ queryKey }) => queryKey.includes('projects') || queryKey.includes('organizations'),
        });
        router.push({ name: 'Project', params: { projectId: data.id } });
      },
    },
  );
};
</script>
