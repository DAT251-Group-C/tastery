import { ApiError, client } from '@/services/api-client';
import { ApiFavorite } from '@/services/api/data-contracts';
import { useAuthStore } from '@/stores/auth';
import { getValue } from '@/utils/vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { AxiosError } from 'axios';
import { storeToRefs } from 'pinia';
import { Ref } from 'vue';

const useCheckFavorite = (recipeId: Ref<string> | string) => {
  const authStore = useAuthStore();
  const { isAuthenticated } = storeToRefs(authStore);

  return useQuery({
    queryKey: ['favorite', { recipeId }],
    queryFn: async () => (await client.favoriteControllerCheckFavorite(getValue(recipeId))).data,
    enabled: isAuthenticated,
  });
};

const useCreateFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiFavorite, AxiosError<ApiError>, string>({
    mutationKey: ['addFavorite'],
    mutationFn: async recipeId => {
      queryClient.setQueryData(['favorite', { recipeId }], true);
      return (await client.favoriteControllerCreateFavorite(recipeId)).data;
    },
    onError: (_, recipeId) => {
      queryClient.setQueryData(['favorite', { recipeId }], false);
    },
  });
};

const useDeleteFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['deleteFavorite'],
    mutationFn: async (recipeId: string) => {
      queryClient.setQueryData(['favorite', { recipeId }], false);
      await client.favoriteControllerDeleteFavorite(recipeId);
    },
    onError: (_, recipeId) => {
      queryClient.setQueryData(['favorite', { recipeId }], true);
    },
  });
};

export { useCheckFavorite, useCreateFavorite, useDeleteFavorite };
