<template>
  <Navbar></Navbar>
  <div class="view">
    <div class="flex gap-x-4">
      <div class="w-full max-w-xs"></div>
      <div class="w-full max-w-xs fixed">
        <p class="text-body-bold h-10 flex items-center">Filters</p>
        <div class="flex flex-wrap gap-2 ring-1 ring-neutral-300 p-4 rounded-sm my-4">
          <Tag
            v-for="filterTag in filterTags"
            :key="filterTag"
            :tag="filterTag"
            role="button"
            class="cursor-pointer"
            tabindex="0"
            @click="search = filterTag"
          >
          </Tag>
        </div>
        <label v-if="isAuthenticated" class="flex gap-x-2 cursor-pointer">
          <input v-model="favorites" type="checkbox" />
          <p class="text-body-bold h-10 flex items-center">Favorites</p>
        </label>
      </div>
      <div class="w-full">
        <div class="flex justify-between">
          <InputText v-model="search" placeholder="Search" size="large"></InputText>
          <RouterLink v-if="isAuthenticated" to="/create">
            <Button label="Create recipe"></Button>
          </RouterLink>
        </div>
        <p v-if="isLoading" class="my-4 text-body-small text-neutral-600">Loading...</p>
        <div :class="['grid grid-cols-2 my-4 gap-4']">
          <RouterLink
            v-for="recipe in recipes"
            :key="recipe.id"
            :to="`/recipe/${recipe.id}`"
            class="flex flex-col ring-1 ring-neutral-300 p-4 gap-y-2 rounded-sm min-h-[136px] hover:bg-neutral-200 hover:ring-primary"
          >
            <p class="text-body-bold">{{ recipe.name }}</p>
            <p class="line-clamp-2 text-body-small text-neutral-600">{{ recipe.description }}</p>
            <div class="flex flex-wrap gap-2 mt-auto">
              <Tag v-for="tag in recipe.tags" :key="tag" :tag="tag"></Tag>
            </div>
          </RouterLink>
        </div>
        <p v-if="!isLoading && recipes?.length === 0" class="text-body-small text-neutral-600">No recipes found</p>
        <Button
          v-if="hasNextPage"
          :loading="isFetchingNextPage"
          loadingIcon="progress_activity"
          label="Load more"
          @click="fetchNextPage()"
        ></Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tag from '@/components/atoms/Tag.vue';
import Navbar from '@/components/templates/Navbar.vue';
import { useFavoriteRecipes, useRecipes } from '@/composables/recipe';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { computed, ref } from 'vue';

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);

const favorites = ref(false);

const search = ref('');
const recipesQuery = useRecipes(search);
const favoriteRecipesQuery = useFavoriteRecipes(search);

const data = computed(() => (favorites.value ? favoriteRecipesQuery.data : recipesQuery.data).value);
const isLoading = computed(() => (favorites.value ? favoriteRecipesQuery.isLoading : recipesQuery.isLoading).value);
const isFetchingNextPage = computed(
  () => (favorites.value ? favoriteRecipesQuery.isFetchingNextPage : recipesQuery.isFetchingNextPage).value,
);
const hasNextPage = computed(() => (favorites.value ? favoriteRecipesQuery.hasNextPage : recipesQuery.hasNextPage).value);
const fetchNextPage = () => (favorites.value ? favoriteRecipesQuery.fetchNextPage() : recipesQuery.fetchNextPage());

const filterTags = ['Spicy', 'Pasta', 'Dinner', 'Chicken', 'Healthy'];

const recipes = computed(() => data.value?.pages.flatMap(page => page.data));
</script>
