import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { client } from '../services/api-client';
import type { ApiUpdateUserDto, ApiUser } from '../services/api/data-contracts';

const useUser = () => {
  return useQuery({
    queryKey: ['user', 'auth'],
    queryFn: async () => {
      return (await client.userControllerGetUser()).data;
    },
  });
};

const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['updateUser'],
    mutationFn: async (data: ApiUpdateUserDto) => {
      return (await client.userControllerUpdateUser(data)).data;
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData(['user'], (user: ApiUser | undefined) => (user ? { ...user, ...variables } : user));
    },
  });
};

export { useUpdateUser, useUser };
