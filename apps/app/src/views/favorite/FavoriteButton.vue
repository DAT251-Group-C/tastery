<template>
  <button class="favorite-button" @click="toggleFavorite">
    <i :class="isFavorite ? 'pi pi-star-fill' : 'pi pi-star'"></i>
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
.favorite-button {
  background: var(--color-primary); /* Primary background */
  border: none;
  cursor: pointer;
  padding: 5px;
  outline: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%; /* Makes the button rounded */
  width: 40px; /* Sets a fixed width */
  height: 40px; /* Sets a fixed height */
}

.pi {
  font-size: 1.5em; /* Adjust size to fit your design */
  color: var(--color-neutral-600); /* Default icon color */
}

.pi-star-fill {
  color: var(--color-primary); /* Change this to your theme's primary color */
}
</style>
