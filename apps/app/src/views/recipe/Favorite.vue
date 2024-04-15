<template>
  <Navbar></Navbar>
  <div class="view">
    <div class="flex justify-between">
      <h1>Favorite Recipes</h1>
    </div>
    <div v-if="isLoading" class="text-body-small text-neutral-600">
      Loading...
    </div>
    <div v-else-if="favoriteRecipes.length" class="grid grid-cols-2 gap-4">
      <div
        v-for="recipe in favoriteRecipes"
        :key="recipe.id"
        class="flex flex-col ring-1 ring-neutral-300 p-4 gap-y-2 rounded-sm hover:bg-neutral-200 hover:ring-primary"
      >
        <h3>{{ recipe.name }}</h3>
        <p>{{ recipe.description }}</p>
      </div>
    </div>
    <p v-else class="text-body-small text-neutral-600">No favorite recipes found.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useFavorites } from '@/composables/favorite';
import Navbar from '@/components/templates/Navbar.vue';
import { ApiFavorite } from '@/services/api/data-contracts';

const favoriteRecipes = ref<ApiFavorite[]>([]);  // Use correct type for your data
const isLoading = ref(true);

const { data, isLoading: isFavoritesLoading } = useFavorites();

// Fetch favorites on component mount
watchEffect(() => {
  if (data.value) {
    // Ensure you access the .value of data, which should contain your actual array of favorites
    favoriteRecipes.value = data.value.pages.flatMap(page => page.data);
    isLoading.value = false;
  }
});
</script>