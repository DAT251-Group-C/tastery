import { ApiError, client } from '@/services/api-client';
import { ApiFavorite, ApiSortOrder } from '@/services/api/data-contracts'; // Assume ApiFavorite is your data contract for favorites
import { useInfiniteQuery, useMutation, useQuery, useQueryClient, useQueryOptions } from '@tanstack/vue-query';
import { AxiosError } from 'axios';
import { Ref } from 'vue';
import { getValue } from '@/utils/vue';

const useFavorites = (search: Ref<string> | string = '', order: ApiSortOrder = ApiSortOrder.DESC, take = 10) => {
  return useInfiniteQuery({
    queryKey: ['favorites', { search, order, take }],
    queryFn: async ({ pageParam: page }) => (await client.favoriteControllerGetFavorites({ page, order, take, search: getValue(search) })).data,
    initialPageParam: 1,
    getNextPageParam: ({ meta }) => (meta.hasNextPage ? meta.page + 1 : undefined),
  });
};
  
/* const useFavorites = (search: Ref<string> | string = '', order: ApiSortOrder = ApiSortOrder.DESC, take = 10) => {
    return useInfiniteQuery({
    queryKey: ['favorites', { search, order, take }],
    queryFn: async ({ pageParam = 1 }) => {
        const response = await client.favoriteControllerGetFavorites({ 
        page: pageParam, 
        order, 
        take, 
        search: getValue(search) 
        });
        return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
        return lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined;
    },
    });
}; */

// useCreateFavorite
// useCreateFavorite.js (in your composable)
const useCreateFavorite = () => {
    const queryClient = useQueryClient();
  
    return useMutation<ApiFavorite, AxiosError<ApiError>, { recipeId: string }>({
      mutationKey: ['addFavorite'],
      mutationFn: async ({ recipeId }) => {
        return (await client.favoriteControllerCreateFavorite({ recipeId })).data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['favorites'] });
      },
    });
  };

  const useCheckFavorite = (recipeId: string, options?: UseQueryOptions<boolean, AxiosError>) => {
    return useQuery<boolean, AxiosError>({
      queryKey: ['checkFavorite', recipeId],
      queryFn: async (): Promise<boolean> => {
        try {
          const response = await client.favoriteControllerCheckFavorite(recipeId);
          return response.data === true; // Assuming response.data directly returns a boolean
        } catch ( error ) {
          throw new Error('Failed to fetch favorite status');
        }
      },
      ...options, // Spread additional options into the useQuery call
      staleTime: 0,
      refetchOnWindowFocus: 'always',
    });
  };
  
const useDeleteFavorite = () => {
    const queryClient = useQueryClient();

    return useMutation({
    mutationKey: ['deleteFavorite'],
    mutationFn: async (recipeId: string) => {
        await client.favoriteControllerDeleteFavorite(recipeId);
    },
    onSuccess: () => {
        // Invalidate and refetch favorites to reflect the deletion
        queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    });
};

export { useFavorites, useCreateFavorite, useDeleteFavorite, useCheckFavorite };
