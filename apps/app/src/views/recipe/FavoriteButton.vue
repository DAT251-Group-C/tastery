<template>
  <button class="favorite-button bg-primary-dark text-neutral-100" @click="toggleFavorite">
    <i :class="isFavorite ? 'pi pi-star' : 'pi pi-star-fill'"></i>
  </button>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useCreateFavorite, useDeleteFavorite } from '@/composables/favorite';

const props = defineProps({
  recipeId: String,
  initialIsFavorite: Boolean
});

const isFavorite = ref(props.initialIsFavorite);

const { mutateAsync: createFavorite } = useCreateFavorite();
const { mutateAsync: deleteFavorite } = useDeleteFavorite();

watch(() => props.initialIsFavorite, (newValue) => {
  isFavorite.value = newValue;
});

const toggleFavorite = async () => {
  console.log("Toggling favorite status for recipe:", props.recipeId);
  if (isFavorite.value) {
    await deleteFavorite(props.recipeId || '')
      .then(() => {
        isFavorite.value = false; // Optimistically update the UI
      })
      .catch(error => {
        console.error('Error removing favorite:', error);
      });
  } else {
    await createFavorite({ recipeId: props.recipeId ?? '' })
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
.flex-container {
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.favorite-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: none;
  cursor: pointer;
  border-radius: 0.375rem;
  transform: translateX(-50%);
}

.favorite-button:hover {
  transform: scale(1.1) translateX(-45%);
  transition: transform 0.3s ease;
}

.pi {
  font-size: 1.4em;
}
</style>