<template>
  <Navbar></Navbar>
  <div class="view">
    <RecipeEditor v-if="data" :dto="data" :loading="isPending" @save="onSave($event)"></RecipeEditor>
  </div>
</template>

<script lang="ts" setup>
import Navbar from '@/components/templates/Navbar.vue';
import RecipeEditor from '@/components/templates/RecipeEditor.vue';
import { useRecipe, useUpdateRecipe } from '@/composables/recipe';
import { useToaster } from '@/composables/toaster';
import { ApiCreateRecipeDto, ApiRecipe } from '@/services/api/data-contracts';
import { onMounted, ref, toRefs, watch } from 'vue';
import { useRouter } from 'vue-router';

const toaster = useToaster();
const router = useRouter();

const data = ref<ApiCreateRecipeDto | null>(null);

const props = defineProps<{ id: string }>();
const { id } = toRefs(props);

const { data: recipe } = useRecipe(id);

watch(recipe, value => {
  console.log('hello!');
  if (value) {
    setData(value);
  }
});

onMounted(() => {
  if (recipe.value) {
    setData(recipe.value);
  }
});

const setData = (recipe: ApiRecipe) => {
  data.value = {
    name: recipe.name,
    description: recipe.description,
    tags: recipe.tags,
    instructions: recipe.instructions,
    ingredients: recipe.ingredients.map(i => ({
      name: i.name,
      amount: i.amount,
      unit: i.unit,
      ean: i.ean,
    })),
  };
};

const { mutateAsync: updateRecipe, isPending, error } = useUpdateRecipe();

const onSave = async (data: ApiCreateRecipeDto) => {
  try {
    await updateRecipe({ id: id.value, ...data });
    toaster.add({ severity: 'success', summary: 'Recipe updated' });
    router.push(`/recipe/${id.value}`);
  } catch {
    toaster.add({
      severity: 'error',
      summary: 'Failed to update recipe',
      detail: error.value?.response?.data.message ?? 'An error occurred',
    });
  }
};
</script>
