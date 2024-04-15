<template>
  <button @click="toggleFavorite" :class="{ 'is-favorite': isFavorite }">
    {{ isFavorite ? 'Unfavorite' : 'Favorite' }}
  </button>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useCreateFavorite, useDeleteFavorite } from '@/composables/favorite';
import { useAuthStore } from '@/stores/auth'; // Assuming useAuthStore handles authentication state

const props = defineProps({
  recipeId: String,
  initialIsFavorite: Boolean
});

// Local state to track if the recipe is favorited
const isFavorite = ref(props.initialIsFavorite);

const { mutateAsync: createFavorite } = useCreateFavorite();
const { mutateAsync: deleteFavorite } = useDeleteFavorite();

watch(() => props.initialIsFavorite, (newValue) => {
  isFavorite.value = newValue;
});

const toggleFavorite = async () => {
  if (isFavorite.value) {
    await deleteFavorite(props.recipeId || '') // Pass as an object
      .then(() => {
        isFavorite.value = false; // Optimistically update the UI
      })
      .catch(error => {
        console.error('Error removing favorite:', error);
      });
  } else {
    await createFavorite({ recipeId: props.recipeId ?? '' }) // Pass as an object
      .then(() => {
        isFavorite.value = true; // Optimistically update the UI
      })
      .catch(error => {
        console.error('Error adding favorite:', error);
      });
  }
};
</script>

<style scoped>
.is-favorite {
  color: red; 
}
</style>
