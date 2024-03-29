<template>
  <div class="view">
    <h1>Create projects</h1>
    <p class="text-neutral-400">Manage your existing projects or create new ones</p>
    <div>
      <InputText v-model="name" placeholder="Name"></InputText>
    </div>
    <div v-if="isError">
      <p>Error creating project</p>
      <p>{{ error }}</p>
    </div>
    <Button size="small" label="Create project" :disabled="isPending" @click="submit()"></Button>
  </div>
</template>

<script setup lang="ts">
import { useCreateProject } from '@/composables/project';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { ref } from 'vue';

const { isPending, isError, error, mutate } = useCreateProject();

const name = ref('');

const submit = () => {
  if (name.value === '') {
    console.log('Name is required');
    return;
  }

  mutate(
    { name: name.value },
    {
      onSuccess: data => {
        console.log('Project created', data);
      },
    },
  );
};
</script>
