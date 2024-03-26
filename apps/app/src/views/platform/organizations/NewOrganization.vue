<template>
  <div class="view">
    <h1>Create organizations</h1>
    <p class="text-neutral-400">Manage your existing organizations or create new ones</p>
    <div>
      <InputText v-model="name" placeholder="Name"></InputText>
    </div>
    <div v-if="isError">
      <p>Error creating organization</p>
      <p>{{ error }}</p>
    </div>
    <Button size="small" label="Create organization" :disabled="isPending" @click="submit()"></Button>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { ref } from 'vue';
import { useCreateOrganization } from '../../../plugins/tanstack/organization';

const { isPending, isError, error, mutate } = useCreateOrganization();

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
        console.log('Organization created', data);
      },
    },
  );
};
</script>
