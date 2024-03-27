import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { client } from '../services/api-client';
import type { ApiUpdateUserDto, ApiUserEntity } from '../services/api/data-contracts';

const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      return (await client.userControllerGetUser()).data;
    },
    staleTime: 1000 * 60 * 5,
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
      queryClient.setQueryData(['user'], (user: ApiUserEntity | undefined) => (user ? { ...user, ...variables } : user));
    },
  });
};

export { useUpdateUser, useUser };
