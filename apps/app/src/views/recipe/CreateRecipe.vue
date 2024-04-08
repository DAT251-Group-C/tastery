<template>
  <Navbar></Navbar>
  <div class="view">
    <div class="flex justify-between items-center">
      <h3>Create recipe</h3>
      <Button
        label="Generate mystery recipe!"
        :loading="isGenerating"
        loadingIcon="progress_activity"
        :disabled="isGenerating"
        @click="generateRecipe()"
      ></Button>
    </div>
    <RecipeEditor
      :class="{ 'opacity-50 pointer-events-none select-none': isGenerating }"
      :dto="dto"
      :loading="loading"
      @save="onSave($event)"
    ></RecipeEditor>
  </div>
</template>

<script lang="ts" setup>
import Navbar from '@/components/templates/Navbar.vue';
import RecipeEditor from '@/components/templates/RecipeEditor.vue';
import { useCreateRecipe, useGenerateRecipe } from '@/composables/recipe';
import { useToaster } from '@/composables/toaster';
import { ApiCreateRecipeDto } from '@/services/api/data-contracts';
import Button from 'primevue/button';
import { ref, toRaw } from 'vue';
import { useRouter } from 'vue-router';

const dto = ref<ApiCreateRecipeDto | undefined>(undefined);
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

const { mutateAsync: generate, isPending: isGenerating } = useGenerateRecipe();
const generateRecipe = async () => {
  try {
    const response = await generate();
    dto.value = toRaw(response);
    toaster.add({ severity: 'success', summary: 'Recipe generated' });
  } catch {
    toaster.add({ severity: 'error', summary: 'Failed to generate recipe' });
  }
};
</script>
