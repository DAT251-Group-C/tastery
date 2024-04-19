<template>
  <Navbar></Navbar>
  <div class="view">
    <div class="flex gap-x-4">
      <div class="w-full max-w-xs"></div>
      <div class="w-full max-w-xs fixed">
        <p class="text-body-bold h-10 flex items-center">Filters</p>
        <div class="flex flex-wrap gap-2 ring-1 ring-neutral-300 p-4 rounded-sm my-4">
          <!-- This could potentially filter the display of favorite recipes if needed -->
        </div>
      </div>
      <div class="w-full">
        <div class="flex justify-between">
          <InputText placeholder="Search favorite recipes" size="large" v-model="search" />
        </div>
        <h1 class="mr-auto">{{ "Favorite recipes" }}</h1>
        <p v-if="isLoading" class="my-4 text-body-small text-neutral-600">Loading...</p>
        <div :class="['grid grid-cols-2 my-4 gap-4']">
          <RouterLink
            v-for="recipe in favoriteRecipes"
            :key="recipe.id"
            :to="`/recipe/${recipe.id}`"
            class="flex flex-col ring-1 ring-neutral-300 p-4 gap-y-2 rounded-sm min-h-[136px] hover:bg-neutral-200 hover:ring-primary">
            <p class="text-body-bold">{{ recipe.name }}</p>
            <p class="line-clamp-2 text-body-small text-neutral-600">{{ recipe.description }}</p>
            <div class="flex flex-wrap gap-2 mt-auto">
              <Chip v-for="tag in recipe.tags" :key="tag" :label="tag" class="bg-primary-dark !text-neutral-100"></Chip>
            </div>
          </RouterLink>
        </div>
        <p v-if="!isLoading && !favoriteRecipes.length" class="text-body-small text-neutral-600">No favorite recipes found</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue';
import { useFavorites } from '@/composables/favorite';
import Navbar from '@/components/templates/Navbar.vue';
import { ApiFavorite } from '@/services/api/data-contracts';
import Chip from 'primevue/chip';

//const favoriteRecipes = ref<ApiFavorite[]>([]);  // Use correct type for your data
//const isLoading = ref(true);

const { data, hasNextPage, isLoading, fetchNextPage, isFetchingNextPage } = useFavorites();

// Fetch favorites on component mount
const favoriteRecipes = computed(() => data.value?.pages.flatMap(page => page.data));

</script>