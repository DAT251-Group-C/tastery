import { ApiError, client } from '@/services/api-client';
import { ApiFavorite, ApiPageDto, ApiSortOrder } from '@/services/api/data-contracts'; // Assume ApiFavorite is your data contract for favorites
import { useAuthStore } from '@/stores/auth';
import { getValue } from '@/utils/vue';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { AxiosError } from 'axios';
import { Ref } from 'vue';

const useFavorites = (order: ApiSortOrder = ApiSortOrder.DESC, take = 10) => {
    return useInfiniteQuery({
      queryKey: ['favorites', { order, take }],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await client.favoriteControllerGetFavorites({
          page: pageParam,
          order,
          take,
        });
        return response.data;  
      },
      getNextPageParam: (lastPage) => {
        return lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined;
      },
      initialPageParam: 1,
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
  
  



/* const useCreateFavorite = () => {
    const queryClient = useQueryClient();

    return useMutation({
    mutationKey: ['createFavorite'],
    mutationFn: async (recipeId: string) => {
        return (await client.favoriteControllerCreateFavorite({ recipeId })).data;
    },
    onSuccess: () => {
        // Invalidate and refetch favorites to update the list with the newly added favorite
        queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    });
}; */

const useDeleteFavorite = () => {
    const queryClient = useQueryClient();

    return useMutation({
    mutationKey: ['deleteFavorite'],
    mutationFn: async (favoriteId: string) => {
        await client.favoriteControllerDeleteFavorite(favoriteId);
    },
    onSuccess: () => {
        // Invalidate and refetch favorites to reflect the deletion
        queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    });
};


export { useFavorites, useCreateFavorite, useDeleteFavorite };
