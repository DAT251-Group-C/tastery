<template>
  <div class="bg-neutral-200 ring-1 ring-neutral-300 rounded-sm p-6">
    <div class="grid grid-cols-3 p-8">
      <span class="text-body-small text-neutral-700">Name</span>
      <Control hideLabel class="col-span-2" hideDetails>
        <InputText v-model="name" size="large"></InputText>
      </Control>
    </div>

    <div class="grid grid-cols-3 p-8">
      <span class="text-body-small text-neutral-700">Description</span>
      <Control hideLabel class="col-span-2" hideDetails>
        <Textarea v-model="description" size="large" rows="3"></Textarea>
      </Control>
    </div>

    <div class="grid grid-cols-3 mb-2 p-8">
      <span class="text-body-small text-neutral-400">Tags</span>
      <div class="col-span-2">
        <div class="flex gap-x-2">
          <Control hideLabel class="w-full" hideDetails>
            <InputText v-model="tag" size="large" placeholder="Italian, Pasta, Spicy" @keypress.enter.prevent="addTag()"></InputText>
          </Control>
          <Button icon="add" size="large" class="!w-[calc(2.5rem-2px)] !h-[calc(2.5rem-2px)] m-px" @click="addTag()"></Button>
        </div>
        <div>
          <p v-if="tags.length === 0" class="text-body-small text-neutral-400 mt-4 mb-3">No tags have been added</p>
          <div class="flex flex-wrap gap-2 mt-4 mb-2">
            <Chip v-for="t in tags" :key="t" :label="t" removable @remove="removeTag(t)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import Chip from 'primevue/chip';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { ref } from 'vue';
import Control from '../atoms/Control.vue';

const name = ref('');
const description = ref('');
const tags = ref<string[]>([]);
const tag = ref('');

const addTag = () => {
  const value = tag.value;

  if (value.length === 0) {
    return;
  }

  if (tags.value.includes(value)) {
    tag.value = '';
    return;
  }

  tags.value.push(value);
  tag.value = '';
};

const removeTag = (tag: string) => {
  tags.value.slice(tags.value.indexOf(tag), 1);
};
</script>
