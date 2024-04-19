<template>
  <Navbar></Navbar>
  <div class="view">
    <div class="flex gap-x-4">
      <div class="w-full max-w-xs"></div>
      <div class="w-full max-w-xs fixed">
        <p class="text-body-bold h-10 flex items-center">Filters</p>
        <div class="flex flex-wrap gap-2 ring-1 ring-neutral-300 p-4 rounded-sm my-4">
          <Chip
            v-for="filterTag in filterTags"
            :key="filterTag"
            class="bg-primary-dark !text-neutral-100 cursor-pointer text-caption"
            @click="search = filterTag"
          >
            <span>{{ filterTag }}</span>
          </Chip>
        </div>
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
            class="flex flex-col ring-1 ring-neutral-300 p-4 gap-y-2 rounded-sm min-h-[136px] hover:bg-neutral-200 hover:ring-primary">
            <p class="text-body-bold">{{ recipe.name }}</p>
            <p class="line-clamp-2 text-body-small text-neutral-600">{{ recipe.description }}</p>
            <div class="flex flex-wrap gap-2 mt-auto">
              <Chip v-for="tag in recipe.tags" :key="tag" :label="tag" class="bg-primary-dark !text-neutral-100"></Chip>
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
import Navbar from '@/components/templates/Navbar.vue';
import { useRecipes } from '@/composables/recipe';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import Chip from 'primevue/chip';
import InputText from 'primevue/inputtext';
import { computed, ref } from 'vue';

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);

const search = ref('');
const { data, hasNextPage, isLoading, fetchNextPage, isFetchingNextPage } = useRecipes(search);

const filterTags = ['Spicy', 'Pasta', 'Dinner', 'Chicken', 'Healthy'];

const recipes = computed(() => data.value?.pages.flatMap(page => page.data));
</script>
