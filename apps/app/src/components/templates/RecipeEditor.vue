<template>
  <form
    :class="[
      'flex flex-col gap-y-8 bg-neutral-200 ring-1 ring-neutral-300 rounded-sm p-6 transition-opacity',
      { 'opacity-50 pointer-events-none select-none': loading },
    ]"
    @submit.prevent="save()"
  >
    <div class="grid grid-cols-3">
      <span class="text-body-small text-neutral-700">Name</span>
      <Control hideLabel class="col-span-2" hideDetails>
        <InputText v-model="name" size="large" placeholder="Recipe name" required></InputText>
      </Control>
    </div>

    <div class="grid grid-cols-3">
      <span class="text-body-small text-neutral-700">Description</span>
      <Control hideLabel class="col-span-2" hideDetails>
        <Textarea v-model="description" size="large" rows="2" placeholder="Recipe description" required></Textarea>
      </Control>
    </div>

    <div class="grid grid-cols-3 mb-2">
      <span class="text-body-small text-neutral-700">Tags</span>
      <div class="col-span-2">
        <div class="flex gap-x-2">
          <Control hideLabel class="w-full" hideDetails>
            <InputText v-model="tag" size="large" placeholder="Italian, Pasta, Spicy" @keypress.enter.prevent="addTag()"></InputText>
          </Control>
          <Button type="button" icon="add" size="large" class="!w-[calc(2.5rem-2px)] !h-[calc(2.5rem-2px)] m-px" @click="addTag()"></Button>
        </div>
        <div>
          <p v-if="tags.length === 0" class="text-body-small text-neutral-600 mt-4 mb-3">No tags have been added</p>
          <div class="flex flex-wrap gap-2 mt-4 mb-2">
            <Chip v-for="t in tags" :key="t" :label="t" removable @remove="removeTag(t)" />
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-3">
      <span class="text-body-small text-neutral-700">Instructions</span>
      <Control hideLabel class="col-span-2" hint="Write a step-by-step instruction on how to create the dish">
        <Textarea v-model="instructions" size="large" rows="5" required placeholder="1. Start by ..."></Textarea>
      </Control>
    </div>

    <div class="flex justify-between">
      <p class="text-body-small-bold">Ingredients</p>
      <Button type="button" label="Add ingredient" @click="addIngredient()"></Button>
    </div>

    <p v-if="ingredients.length === 0" class="text-body-small text-neutral-600">No ingredients added yet</p>

    <div
      v-for="(ingredient, i) in ingredients"
      :key="i"
      class="grid grid-cols-3 gap-x-4 gap-y-8 bg-neutral-100 ring-1 ring-neutral-300 rounded-sm p-6"
    >
      <!-- <span class="text-body-small text-neutral-700">EAN</span>
      <Control hideLabel hideDetails>
        <InputText v-model="ingredient.ean" size="large" required></InputText>
      </Control>
      <div></div> -->

      <span class="text-body-small text-neutral-700">Name</span>
      <Control hideLabel hideDetails>
        <InputText v-model="ingredient.name" size="large" required></InputText>
      </Control>
      <Button type="button" class="justify-self-end" severity="neutral" icon="delete" @click="removeIngredient(i)"></Button>

      <span class="text-body-small text-neutral-700">Amount</span>
      <div class="grid grid-cols-[auto_1fr] gap-x-2 justify-between w-full">
        <Control hideLabel hideDetails>
          <InputNumber v-model="ingredient.amount" size="large" required></InputNumber>
        </Control>
        <Control hideLabel hideDetails>
          <Dropdown
            v-model="ingredient.unit"
            :options="unitOptions"
            optionLabel="label"
            optionValue="value"
            size="large"
            required
          ></Dropdown>
        </Control>
      </div>
    </div>
    <Button v-if="ingredients.length > 0" type="button" label="Add ingredient" class="self-start" @click="addIngredient()"></Button>

    <div class="flex justify-end">
      <Button type="submit" label="Save"></Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ApiCreateIngredientDto, ApiCreateRecipeDto, ApiIngredientUnit } from '@/services/api/data-contracts';
import Button from 'primevue/button';
import Chip from 'primevue/chip';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { onMounted, ref, toRaw, toRefs, watch } from 'vue';
import Control from '../atoms/Control.vue';

const name = ref('');
const description = ref('');
const instructions = ref('');
const tags = ref<string[]>([]);
const tag = ref('');
const ingredients = ref<ApiCreateIngredientDto[]>([]);

const props = defineProps<{ dto?: ApiCreateRecipeDto; loading?: boolean }>();
const { dto, loading } = toRefs(props);

watch(dto, value => {
  if (value) {
    setValues(value);
  }
});

onMounted(() => {
  if (dto.value) {
    setValues(dto.value);
  }
});

const emits = defineEmits<{
  (event: 'save', data: ApiCreateRecipeDto): void;
}>();

const save = () => {
  emits('save', {
    name: toRaw(name.value),
    description: toRaw(description.value),
    tags: toRaw(tags.value),
    instructions: toRaw(instructions.value),
    ingredients: toRaw(ingredients.value),
  });
};

const setValues = (data: ApiCreateRecipeDto) => {
  name.value = data.name;
  description.value = data.description;
  instructions.value = data.instructions;

  tags.value.splice(0, tags.value.length);
  data.tags.forEach(t => tags.value.push(t));

  ingredients.value.splice(0, ingredients.value.length);
  data.ingredients.forEach(i => ingredients.value.push(i));
};

const _options: Record<ApiIngredientUnit, string> = {
  [ApiIngredientUnit.G]: 'Gram',
  [ApiIngredientUnit.Kg]: 'Kilogram',
  [ApiIngredientUnit.Ml]: 'Milliliter',
  [ApiIngredientUnit.L]: 'Liter',
  [ApiIngredientUnit.Unit]: 'Piece',
  [ApiIngredientUnit.Tsp]: 'Teaspoon',
  [ApiIngredientUnit.Tbsp]: 'Tablesp',
  [ApiIngredientUnit.Clove]: 'Clove',
  [ApiIngredientUnit.Pinch]: 'Pinch',
  [ApiIngredientUnit.Slice]: 'Slice',
  [ApiIngredientUnit.Cup]: 'Cup',
};

const unitOptions: Array<{ label: string; value: ApiIngredientUnit }> = Object.entries(_options).map(([key, value]) => ({
  label: value,
  value: key as ApiIngredientUnit,
}));

const addIngredient = () => {
  ingredients.value.push({
    ean: '',
    name: '',
    amount: 0,
    unit: ApiIngredientUnit.G,
  });
};

const removeIngredient = (index: number) => {
  ingredients.value.splice(index, 1);
};

const addTag = () => {
  const value = tag.value;

  if (value.length === 0) {
    return;
  }

  if (tags.value.includes(value)) {
    tag.value = '';
    return;
  }

  tags.value.push(value);
  tag.value = '';
};

const removeTag = (tag: string) => {
  tags.value.slice(tags.value.indexOf(tag), 1);
};
</script>
