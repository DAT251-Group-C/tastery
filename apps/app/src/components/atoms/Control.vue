<template>
  <div class="flex flex-col gap-2">
    <label v-if="!hideLabel" :for="id" class="text-body-small text-neutral-400">
      <span v-if="label.length === 0">&nbsp;</span>
      <span v-else>{{ label }}</span>
    </label>
    <slot :id="id"></slot>

    <template v-if="!hideDetails">
      <div v-if="error" class="text-caption text-error">error</div>
      <div v-else class="text-caption text-neutral-400">
        <span v-if="hint.length === 0">&nbsp;</span>
        <span v-else>{{ hint }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { v4 } from 'uuid';
import { computed } from 'vue';

interface Props {
  label?: string;
  id?: string;
  hideLabel?: boolean;
  hideDetails?: boolean;
  hint?: string;
  errors?: string | string[];
  size?: 'small' | null | 'large';
}

const { errors, hideLabel, hideDetails } = withDefaults(defineProps<Props>(), {
  id: v4(),
  size: null,
  hideLabel: false,
  hideDetails: false,
  errors: '',
  hint: '',
  label: '',
});

const error = computed(() => {
  const _errors = Array.isArray(errors) ? errors : [errors];
  return _errors.length > 0 ? _errors[0] : null;
});
</script>
