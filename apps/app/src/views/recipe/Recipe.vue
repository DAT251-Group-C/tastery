<template>
  <Navbar></Navbar>
  <div v-if="recipe" class="small-view">
    <div class="flex flex-col gap-y-6">
      <div class="flex gap-2">
        <h3 class="mr-auto">{{ recipe.name }}</h3>
        <RouterLink v-if="user?.id === recipe.userId" :to="`/recipe/${id}/edit`">
          <Button label="Edit" icon="edit"></Button>
        </RouterLink>
        <FavoriteButton v-if="user" :recipeId="recipe.id" :initialIsFavorite="isFavorite" />        <Button
          v-if="user?.id === recipe.userId"
          label="Delete"
          severity="error"
          :loading="deletePending"
          loadingIcon="progress_activity"
          :disabled="deletePending"
          icon="delete"
          @click="onDelete()"
        ></Button>
      </div>

      <p class="text-body-small text-neutral-600">{{ recipe.description }}</p>

      <div class="flex flex-wrap gap-2">
        <Chip v-for="tag in recipe.tags" :key="tag" :label="tag" class="bg-primary-dark !text-neutral-100"></Chip>
      </div>

      <p class="text-body-small-bold mt-6">Ingredients</p>

      <div class="flex flex-wrap gap-2">
        <div v-for="ingredient in recipe.ingredients" :key="ingredient.ean" class="px-4 py-2 gap-1 ring-1 ring-neutral-300 rounded-xs">
          <p class="text-body-small-bold">{{ ingredient.name }}</p>
          <p class="text-neutral-700 text-body-small">Amount: {{ ingredient.amount }} {{ ingredient.unit }}</p>
        </div>
      </div>

      <p class="text-body-small-bold mt-6">Instructions</p>
      <p v-for="line in recipe.instructions.split('\n')" :key="line">{{ line }}</p>
    </div>
  </div>
  <div v-else class="view">
    <span class="text-neutral-600 text-body-small">Loading...</span>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/templates/Navbar.vue';
import { useDeleteRecipe, useRecipe } from '@/composables/recipe';
import { useToaster } from '@/composables/toaster';
import { useUser } from '@/composables/user';
import Button from 'primevue/button';
import Chip from 'primevue/chip';
import { toRefs } from 'vue';
import { useRouter } from 'vue-router';
import FavoriteButton from '@/views/favorite/FavoriteButton.vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { useCheckFavorite } from '@/composables/favorite';

const props = defineProps<{ id: string }>();
const { id } = toRefs(props);

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);

const toaster = useToaster();
const router = useRouter();

const { data: recipe } = useRecipe(id);

const { data: user } = useUser();

const { mutateAsync: deleteRecipe, error: deleteError, isPending: deletePending } = useDeleteRecipe();

const { data: isFavorite } = useCheckFavorite(id.value);

const onDelete = async () => {
  try {
    await deleteRecipe(id.value);
    toaster.add({ severity: 'success', summary: 'Recipe deleted' });
    router.push('/');
  } catch {
    toaster.add({
      severity: 'error',
      summary: 'Failed to delete recipe',
      detail: deleteError.value?.response?.data.message ?? 'An unknown error occurred',
    });
  }
};
</script>
