<template>
  <Navbar></Navbar>
  <div class="view">
    <div class="flex justify-between">
      <h1>Favorite Recipes recipes</h1>
    </div>
    <div v-if="isFetching" class="my-4 text-body-small text-neutral-600">Loading...</div>
    <div v-else-if="recipes?.length > 0" :class="['grid grid-cols-2 my-4 gap-4']">
      <RouterLink
        v-for="recipe in recipes"
        :key="recipe.id"
        :to="`/recipe/${recipe.id}`"
        class="flex flex-col ring-1 ring-neutral-300 p-4 gap-y-2 rounded-sm min-h-[136px] hover:bg-neutral-200 hover:ring-primary"
      >
        <p class="text-body-bold">{{ recipe.name }}</p>
        <p class="line-clamp-2 text-body-small text-neutral-600">{{ recipe.description }}</p>
      </RouterLink>
    </div>
    <p v-else class="text-body-small text-neutral-600">No favorite recipes found</p>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/templates/Navbar.vue';
import { useFavorites } from '@/composables/favorite';
import { RouterLink } from 'vue-router';
import { computed, ref, onMounted } from 'vue';

const { data, isFetching, isLoading, fetchNextPage, hasNextPage } = useFavorites();
//const isLoading = ref(true);

// Adjust this to handle the data structure returned by your favorites endpoint

const recipes = computed(() => data.value?.pages.flatMap(page => page.data));


onMounted(async () => {
  if (hasNextPage) {
    await fetchNextPage();
  }
  isLoading.value = false;
});
</script>
