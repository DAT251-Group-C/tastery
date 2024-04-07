<template>
  <Navbar></Navbar>
  <div class="view">
    <h3>Create recipe</h3>
    <RecipeEditor :loading="loading" @save="onSave($event)"></RecipeEditor>
  </div>
</template>

<script lang="ts" setup>
import Navbar from '@/components/templates/Navbar.vue';
import RecipeEditor from '@/components/templates/RecipeEditor.vue';
import { useCreateRecipe } from '@/composables/recipe';
import { useToaster } from '@/composables/toaster';
import { ApiCreateRecipeDto } from '@/services/api/data-contracts';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const toaster = useToaster();
const router = useRouter();
const loading = ref(false);
const { mutateAsync: createRecipe, error } = useCreateRecipe();

const onSave = async (data: ApiCreateRecipeDto) => {
  loading.value = true;
  try {
    const recipe = await createRecipe(data);
    toaster.add({ severity: 'success', summary: 'Recipe created' });
    router.push(`/recipe/${recipe.id}`);
  } catch {
    toaster.add({
      severity: 'error',
      summary: 'Failed to create recipe',
      detail: error.value?.response?.data.message ?? 'An unknown error occurred',
    });
  } finally {
    loading.value = false;
  }
};
</script>
