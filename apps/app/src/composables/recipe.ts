import { ApiError, client } from '@/services/api-client';
import { ApiCreateRecipeDto, ApiRecipe, ApiSortOrder, ApiUpdateRecipeDto } from '@/services/api/data-contracts';
import { useAuthStore } from '@/stores/auth';
import { getValue } from '@/utils/vue';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { AxiosError } from 'axios';
import { storeToRefs } from 'pinia';
import { Ref } from 'vue';

const useRecipes = (search: Ref<string> | string = '', order: ApiSortOrder = ApiSortOrder.DESC, take = 10) => {
  return useInfiniteQuery({
    queryKey: ['recipes', { search, order, take }],
    queryFn: async ({ pageParam: page }) => (await client.recipeControllerGetRecipes({ page, order, take, search: getValue(search) })).data,
    initialPageParam: 1,
    getNextPageParam: ({ meta }) => (meta.hasNextPage ? meta.page + 1 : undefined),
  });
};

const useFavoriteRecipes = (search: Ref<string> | string = '', order: ApiSortOrder = ApiSortOrder.DESC, take = 10) => {
  const authStore = useAuthStore();
  const { isAuthenticated } = storeToRefs(authStore);

  return useInfiniteQuery({
    queryKey: ['recipes', 'favorite', { search, order, take }],
    queryFn: async ({ pageParam: page }) =>
      (await client.recipeControllerGetFavoriteRecipes({ page, order, take, search: getValue(search) })).data,
    enabled: isAuthenticated,
    initialPageParam: 1,
    getNextPageParam: ({ meta }) => (meta.hasNextPage ? meta.page + 1 : undefined),
  });
};

const useRecipe = (id: Ref<string> | string) => {
  return useQuery<ApiRecipe, AxiosError<ApiError>>({
    queryKey: ['recipe', { id }],
    queryFn: async () => (await client.recipeControllerGetRecipeById(getValue(id))).data,
  });
};

const useCreateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiRecipe, AxiosError<ApiError>, ApiCreateRecipeDto>({
    mutationKey: ['createRecipe'],
    mutationFn: async (data: ApiCreateRecipeDto) => {
      return (await client.recipeControllerCreateRecipe(data)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: ({ queryKey }) => queryKey[0] === 'recipes' });
    },
  });
};

const useGenerateRecipe = () => {
  return useMutation<ApiCreateRecipeDto, AxiosError<ApiError>>({
    mutationKey: ['generateRecipe'],
    mutationFn: async () => {
      return (await client.recipeControllerGenerateRecipe()).data;
    },
  });
};

const useUpdateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ApiError>, ApiUpdateRecipeDto & { id: string }>({
    mutationKey: ['updateRecipe'],
    mutationFn: async data => {
      const { id, ...body } = data;
      return (await client.recipeControllerUpdateRecipe(id, body)).data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ predicate: ({ queryKey }) => queryKey[0] === 'recipes' });
      queryClient.invalidateQueries({ queryKey: ['recipe', { id }] });
    },
  });
};

const useDeleteRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ApiError>, string>({
    mutationKey: ['deleteRecipe'],
    mutationFn: async (id: string) => {
      return (await client.recipeControllerDeleteRecipe(id)).data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ predicate: ({ queryKey }) => queryKey[0] === 'recipes' });
      queryClient.invalidateQueries({ queryKey: ['recipe', { id }] });
    },
  });
};

export { useCreateRecipe, useDeleteRecipe, useFavoriteRecipes, useGenerateRecipe, useRecipe, useRecipes, useUpdateRecipe };
