import { ApiError, client } from '@/services/api-client';
import { ApiCreateRecipeDto, ApiRecipe, ApiSortOrder, ApiUpdateRecipeDto } from '@/services/api/data-contracts';
import { getValue } from '@/utils/vue';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { AxiosError } from 'axios';
import { Ref } from 'vue';

const useRecipes = (search: Ref<string> | string = '', order: ApiSortOrder = ApiSortOrder.DESC, take = 10) => {
  return useInfiniteQuery({
    queryKey: ['recipes', { search, order, take }],
    queryFn: async ({ pageParam: page }) => (await client.recipeControllerGetRecipes({ page, order, take, search: getValue(search) })).data,
    initialPageParam: 1,
    getNextPageParam: ({ meta }) => (meta.hasNextPage ? meta.page + 1 : undefined),
  });
};

const useRecipesByIds = (recipeIds: Ref<string[]>) => {
  return useQuery<ApiRecipe[], AxiosError>({
    queryKey: ['recipesByIds', recipeIds],
    queryFn: async () => {
      if (recipeIds.value.length === 0) {
        return []; // Avoids running the query if no IDs are provided
      }
      try {
        const responses = await Promise.all(
          recipeIds.value.map(id => client.recipeControllerGetRecipeById(id))
        );
        return responses.map(res => res.data); // assuming res.data holds your actual recipe data
      } catch (error) {
        console.error("Error fetching recipes by IDs:", error);
        throw error; // Properly propagate the error for error boundaries or further handling
      }
    },
    enabled: recipeIds.value.length > 0 // Only run the query if there are IDs
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

export { useCreateRecipe, useDeleteRecipe, useGenerateRecipe, useRecipe, useRecipes, useUpdateRecipe, useRecipesByIds};
