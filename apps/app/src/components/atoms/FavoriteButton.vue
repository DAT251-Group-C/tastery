<template>
  <Button
    severity="plain"
    :class="[{ '!text-primary-dark': isFavorite }, 'focus:!ring-0 focus:!ring-offset-0']"
    icon="favorite"
    :loading="isLoading"
    loadingIcon="progress_activity"
    :filled="isFavorite"
    @click="toggleFavorite"
  >
  </Button>
</template>

<script setup lang="ts">
import { useCheckFavorite, useCreateFavorite, useDeleteFavorite } from '@/composables/favorite';
import Button from 'primevue/button';
import { toRefs } from 'vue';

const props = defineProps<{
  recipeId: string;
}>();

const { recipeId } = toRefs(props);

const { data: isFavorite, isLoading } = useCheckFavorite(recipeId);

const { mutateAsync: createFavorite } = useCreateFavorite();
const { mutateAsync: deleteFavorite } = useDeleteFavorite();

const toggleFavorite = async () => {
  if (isFavorite.value) {
    deleteFavorite(recipeId.value);
  } else {
    createFavorite(recipeId.value);
  }
};
</script>
