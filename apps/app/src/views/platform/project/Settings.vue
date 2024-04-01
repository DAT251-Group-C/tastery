<template>
  <div class="view max-w-4xl">
    <Skeleton v-if="!isFetchedAfterMount" class="w-full h-[128px] ring-1 ring-neutral-700 rounded-sm"></Skeleton>
    <div v-else class="flex flex-col gap-y-4 bg-neutral-800 ring-1 ring-neutral-700 px-6 py-4 rounded-sm">
      <h1 class="text-body text-neutral-200 mb-4">Project information</h1>

      <div class="grid md:grid-cols-3 gap-4 mb-2">
        <span class="text-body-small text-neutral-400">API key</span>
        <Control hideLabel class="col-span-2" hideDetails>
          <InputText :modelValue="project?.apiKey" type="email" size="large" disabled readonly></InputText>
        </Control>
      </div>
    </div>

    <Skeleton v-if="!isFetchedAfterMount" class="w-full h-[185px] ring-1 ring-neutral-700 rounded-sm"></Skeleton>
    <form v-else class="flex flex-col gap-y-4 bg-neutral-800 ring-1 ring-neutral-700 px-6 py-4 rounded-sm" @submit.prevent="submit()">
      <h1 class="text-body text-neutral-200 mb-4">General settings</h1>

      <div class="grid md:grid-cols-3 gap-4 mb-2">
        <span class="text-body-small text-neutral-400">Name</span>
        <Control hideLabel class="col-span-2" hideDetails>
          <InputText v-model="name" size="large" :disabled="isPending"></InputText>
        </Control>
      </div>

      <div class="grid md:grid-cols-3 gap-4 mb-2">
        <span class="text-body-small text-neutral-400">Description</span>
        <Control hideLabel class="col-span-2" hideDetails>
          <Textarea v-model="description" size="large" :disabled="isPending" rows="3" class="max-h-[12rem]"></Textarea>
        </Control>
      </div>

      <div class="grid md:grid-cols-3 gap-4 mb-2">
        <!-- TODO: Tooltip (Add the URLs where the chatbot will be embedded) -->
        <span class="text-body-small text-neutral-400">Referrer URLs</span>
        <div class="col-span-2">
          <div class="flex gap-x-2">
            <Control hideLabel class="w-full" hideDetails>
              <InputText
                v-model="referrerUrl"
                size="large"
                placeholder="https://your-domain.com"
                :invalid="referrerUrl.length > 0 && !referrerValid && referrerUrlAdding === referrerUrl"
                :disabled="isPending"
                @keypress.enter.prevent="addReferrer()"
              ></InputText>
            </Control>
            <Button icon="add" size="large" class="!w-[calc(2.5rem-2px)] !h-[calc(2.5rem-2px)] m-px" @click="addReferrer()"></Button>
          </div>
          <div>
            <p v-if="referrerUrls.length === 0" class="text-body-small text-neutral-400 mt-4 mb-3">No URLs have been added</p>
            <div class="flex flex-wrap gap-2 mt-4 mb-2">
              <Chip v-for="url in referrerUrls" :key="url" :label="url" removable @remove="removeReferrer(url)" />
            </div>
          </div>
        </div>
      </div>

      <hr class="border-neutral-700 -mx-6" />
      <div class="flex items-center justify-end gap-x-2">
        <RouterLink to="/platform" tabindex="-1">
          <Button size="small" label="Cancel" severity="neutral"></Button>
        </RouterLink>
        <Button
          :disabled="isLoading || !isDirty || isPending"
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
import Skeleton from '@/components/atoms/Skeleton.vue';
import { useProject, useUpdateProject } from '@/composables/project';
import { useToaster } from '@/composables/toaster';
import { ApiFullProject } from '@/services/api/data-contracts';
import { isValidUrl } from '@/utils/validators';
import Button from 'primevue/button';
import Chip from 'primevue/chip';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { computed, ref, toRefs, watch } from 'vue';

const props = defineProps<{ projectId: string }>();
const { projectId } = toRefs(props);

const { data: project, isFetchedAfterMount, isLoading } = useProject(projectId);

const toaster = useToaster();
const name = ref('');
const description = ref('');
const referrerUrl = ref('');
const referrerUrls = ref<string[]>([]);

watch(project, () => {
  if (project.value) {
    updateModels(project.value);
  }
});

const updateModels = (project: ApiFullProject) => {
  name.value = project.name;
  description.value = project.description;
  referrerUrls.value = [...project.referrerUrls];
};

if (project.value) {
  updateModels(project.value);
}

const { mutateAsync: updateProject, isPending, error: updateError } = useUpdateProject();

const submit = async () => {
  try {
    await updateProject({ name: name.value, description: description.value, referrerUrls: referrerUrls.value, projectId: projectId.value });
    toaster.add({ severity: 'success', summary: 'Project updated', detail: 'Your changes have been saved', life: 5000 });
  } catch {
    toaster.add({
      severity: 'error',
      summary: 'Error updating project',
      detail: updateError.value?.response?.data.message ?? 'An unknown error occurred',
      life: 5000,
    });
  }
};

const isDirty = computed(() => {
  if (!project.value) {
    return true;
  }

  if (name.value !== project.value.name) {
    return true;
  }

  if (description.value !== project.value.description) {
    return true;
  }

  if (referrerUrls.value.length !== project.value.referrerUrls.length) {
    return true;
  }

  for (const referrerUrl of referrerUrls.value) {
    if (!project.value.referrerUrls.includes(referrerUrl)) {
      return true;
    }
  }

  return false;
});

const referrerValid = computed(() => isValidUrl(referrerUrl.value));
const referrerUrlAdding = ref('');

watch(
  () => referrerUrl.value,
  () => {
    referrerUrlAdding.value = '';
  },
);

const addReferrer = () => {
  if (!referrerUrl.value || isPending.value) {
    toaster.add({ severity: 'error', summary: 'Invalid URL', detail: 'Please enter a valid URL' });
    return;
  }

  referrerUrlAdding.value = referrerUrl.value;

  if (!referrerValid.value) {
    toaster.add({ severity: 'error', summary: 'Invalid URL', detail: 'Please enter a valid URL' });
    return;
  }

  if (referrerUrls.value.includes(referrerUrl.value)) {
    toaster.add({ severity: 'info', summary: 'URL already added', detail: 'This URL has already been added' });
    return;
  }

  referrerUrls.value.push(referrerUrl.value);
  referrerUrl.value = '';
  referrerUrlAdding.value = '';
};

const removeReferrer = (url: string) => {
  if (isPending.value) {
    return;
  }

  referrerUrls.value = referrerUrls.value.filter(u => u !== url);
};
</script>
