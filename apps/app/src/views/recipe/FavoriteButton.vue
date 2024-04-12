<template>
  <button @click="toggleFavorite" :class="{ 'is-favorite': isFavorite }">
    {{ isFavorite ? 'Unfavorite' : 'Favorite' }}
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCreateFavorite, useDeleteFavorite } from '@/composables/favorite';
import { useAuthStore } from '@/stores/auth'; // Assuming useAuthStore handles authentication state

const props = defineProps({
  recipeId: {
    type: String,
    required: true
  }
});

const { isAuthenticated } = useAuthStore();

// Local state to track if the recipe is favorited
const isFavorite = ref(false);
// Mutation hooks for creating and deleting favorites
//const createFavorite = useCreateFavorite();
//const deleteFavorite = useDeleteFavorite();

const { mutateAsync: createFavorite } = useCreateFavorite();
const { mutateAsync: deleteFavorite } = useDeleteFavorite();

const toggleFavorite = async () => {
  if (isFavorite.value) {
    await deleteFavorite(props.recipeId) // Pass as an object
      .then(() => {
        isFavorite.value = false; // Optimistically update the UI
      })
      .catch(error => {
        console.error('Error removing favorite:', error);
      });
  } else {
    await createFavorite({ recipeId: props.recipeId }) // Pass as an object
      .then(() => {
        isFavorite.value = true; // Optimistically update the UI
      })
      .catch(error => {
        console.error('Error adding favorite:', error);
      });
  }
};


// Function to toggle the favorite status
/* const toggleFavorite = async () => {
  if (!isAuthenticated) {
    alert('Please log in to favorite recipes.');
    return;
  }

  // Ensure recipeId is defined before making API calls
  if (!props.recipeId) {
    console.error('Recipe ID is undefined.');
    return;
  }

  if (isFavorite.value) {
    await deleteFavorite.mutateAsync(props.recipeId, {
      onSuccess: () => {
        isFavorite.value = false; // Optimistically update the UI
        console.log('Favorite removed successfully');
      },
      onError: (error) => {
        console.error('Error removing favorite:', error);
      }
    });
  } else {
    await createFavorite.mutateAsync(props.recipeId, {
      onSuccess: () => {
        isFavorite.value = true; // Optimistically update the UI
        console.log('Favorite added successfully');
      },
      onError: (error) => {
        console.error('Error adding favorite:', error);
      }
    });
  }
}; */
</script>

<style scoped>
.is-favorite {
  color: red; 
}
</style>
