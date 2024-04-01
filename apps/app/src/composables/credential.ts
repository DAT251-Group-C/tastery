import { useAuthStore } from '@/stores/auth';
import { getValue } from '@/utils/vue';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { AxiosError } from 'axios';
import { storeToRefs } from 'pinia';
import { Ref } from 'vue';
import { ApiError, client } from '../services/api-client';
import { ApiCreateCredentialDto, ApiCredential, ApiUpdateCredentialDto } from '../services/api/data-contracts';

const useCredentials = (projectId: string | Ref<string>) => {
  const authStore = useAuthStore();
  const { isAuthenticated } = storeToRefs(authStore);

  return useInfiniteQuery({
    queryKey: ['credentials', { projectId }],
    queryFn: async ({ pageParam: page }) => (await client.credentialControllerGetCredentials(getValue(projectId), { page })).data,
    enabled: isAuthenticated,
    initialPageParam: 1,
    getNextPageParam: ({ meta }) => (meta.hasNextPage ? meta.page + 1 : undefined),
  });
};

const useCreateCredential = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiCredential, AxiosError<ApiError>, ApiCreateCredentialDto & { projectId: string }>({
    mutationKey: ['createCredential'],
    mutationFn: async data => {
      const { projectId, ...body } = data;
      return (await client.credentialControllerCreateCredential(projectId, body)).data;
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['credentials', { projectId }] });
    },
  });
};

const useUpdateCredential = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ApiError>, ApiUpdateCredentialDto & { projectId: string; credentialId: string }>({
    mutationKey: ['updateCredential'],
    mutationFn: async data => {
      const { credentialId, projectId, ...body } = data;
      return (await client.credentialControllerUpdateCredential(credentialId, projectId, body)).data;
    },
    onSuccess: async (_, { projectId }) => {
      await queryClient.invalidateQueries({ queryKey: ['credentials', { projectId }] });
    },
  });
};

const useDeleteCredential = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ApiError>, { projectId: string; credentialId: string }>({
    mutationKey: ['deleteCredential'],
    mutationFn: async ({ projectId, credentialId }) => {
      return (await client.credentialControllerDeleteCredential(credentialId, projectId)).data;
    },
    onSuccess: async (_, { projectId }) => {
      await queryClient.invalidateQueries({ queryKey: ['credentials', { projectId }] });
    },
  });
};

export { useCreateCredential, useCredentials, useDeleteCredential, useUpdateCredential };
