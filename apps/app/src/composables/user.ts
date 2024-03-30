import { useAuthStore } from '@/stores/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';
import { ApiError, client } from '../services/api-client';
import type { ApiUpdateUserDto } from '../services/api/data-contracts';
import { AxiosError } from 'axios';

const useUser = () => {
  const authStore = useAuthStore();
  const { isAuthenticated } = storeToRefs(authStore);

  return useQuery({
    queryKey: ['user'],
    queryFn: async () => (await client.userControllerGetUser()).data,
    enabled: isAuthenticated,
  });
};

const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ApiError>, ApiUpdateUserDto>({
    mutationKey: ['updateUser'],
    mutationFn: async (data: ApiUpdateUserDto) => {
      return (await client.userControllerUpdateUser(data)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export { useUpdateUser, useUser };
