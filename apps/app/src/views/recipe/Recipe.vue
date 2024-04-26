<template>
  <Navbar></Navbar>
  <div v-if="recipe" class="small-view">
    <div class="flex flex-col gap-y-6">
      <div class="flex gap-2">
        <h3 class="mr-auto">{{ recipe.name }}</h3>
        <FavoriteButton v-if="isAuthenticated && user" :recipeId="id" />
        <RouterLink v-if="user?.id === recipe.userId" :to="`/recipe/${id}/edit`">
          <Button label="Edit" icon="edit"></Button>
        </RouterLink>
        <Button
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
        <Tag v-for="tag in recipe.tags" :key="tag" :tag="tag"></Tag>
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
  <div v-if="recipe">
    <div v-for="ingredient in recipe.ingredients" :key="ingredient.name">
      <label>{{ ingredient.name }}</label>
      <select v-if="productsMap.get(ingredient.name)">
        <option v-if="productsMap.get(ingredient.name).isLoading">Loading...</option>
        <option v-else-if="productsMap.get(ingredient.name).error">Error loading products</option>
        <option v-for="product in productsMap.get(ingredient.name).data" :value="product" :key="product.name">
          {{ product.name }} - ${{ product.current_price }}</option>
        </select>
      <select v-else>
        <!-- Placeholder in case the products are not yet fetched -->
        <option>Loading products...</option>
      </select>
    </div>
  </div>
  <div v-else>
    No recipe loaded.
  </div>
</template>

<script setup lang="ts">
import FavoriteButton from '@/components/atoms/FavoriteButton.vue';
import Tag from '@/components/atoms/Tag.vue';
import Navbar from '@/components/templates/Navbar.vue';
import { useProductsForIngredient, Product } from '@/composables/kassalapp';
import { useDeleteRecipe, useRecipe } from '@/composables/recipe';
import { useToaster } from '@/composables/toaster';
import { useUser } from '@/composables/user';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { toRefs, reactive, onMounted, ref, watch, computed, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{ id: string }>();
const { id } = toRefs(props);

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);

const toaster = useToaster();
const router = useRouter();

const { data: recipe } = useRecipe(id);
const { data: user } = useUser();
const { mutateAsync: deleteRecipe, error: deleteError, isPending: deletePending } = useDeleteRecipe();

const ingredientQuery = ref('');
const productQueries = ref([]);
const productsQuery = useProductsForIngredient(ingredientQuery.value);
const { data: products, isLoading, error, refetch } = productsQuery;

const productsMap = reactive(new Map());

function setupProductQuery(ingredientName: string) {
  const query = useProductsForIngredient(ingredientName);
  productsMap.set(ingredientName, query);
}

watch(() => recipe.value?.ingredients, (newIngredients, oldIngredients) => {
  if (newIngredients && newIngredients.length > 0) {
    newIngredients.forEach(ingredient => {
      if (!productsMap.has(ingredient.name)) {
        productsMap.set(ingredient.name, { isLoading: true, data: [], error: null });
        setupProductQuery(ingredient.name);
      }
    });
    if (oldIngredients) {
      oldIngredients.forEach(ingredient => {
        if (!newIngredients.some(newIng => newIng.name === ingredient.name)) {
          productsMap.delete(ingredient.name);
        }
      });
    }
  }
}, { deep: true, immediate: true });

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
