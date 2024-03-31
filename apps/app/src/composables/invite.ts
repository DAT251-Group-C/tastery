import { useAuthStore } from '@/stores/auth';
import { getValue } from '@/utils/vue';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { AxiosError } from 'axios';
import { storeToRefs } from 'pinia';
import { Ref } from 'vue';
import { ApiError, client } from '../services/api-client';
import { ApiCreateInviteDto, ApiInvite, ApiSortOrder } from '../services/api/data-contracts';

const useInvites = () => {
  const authStore = useAuthStore();
  const { isAuthenticated } = storeToRefs(authStore);

  return useInfiniteQuery({
    queryKey: ['invites'],
    queryFn: async ({ pageParam: page }) => (await client.inviteControllerGetInvites({ page })).data,
    enabled: isAuthenticated,
    initialPageParam: 1,
    getNextPageParam: ({ meta }) => (meta.hasNextPage ? meta.page + 1 : undefined),
  });
};

const useInviteByHash = (hash: string | Ref<string>) => {
  return useQuery<ApiInvite, AxiosError<ApiError>>({
    queryKey: ['inviteByHash', { hash }],
    queryFn: async () => (await client.inviteControllerGetInviteByHash(getValue(hash))).data,
  });
};

const useOrganizationInvites = (id: string | Ref<string>, order: ApiSortOrder = ApiSortOrder.DESC, take = 10) => {
  const authStore = useAuthStore();
  const { isAuthenticated } = storeToRefs(authStore);

  return useInfiniteQuery({
    queryKey: ['organizationInvites', { id }],
    queryFn: async ({ pageParam: page }) => (await client.inviteControllerGetOrganizationInvites(getValue(id), { page, order, take })).data,
    enabled: isAuthenticated,
    initialPageParam: 1,
    getNextPageParam: ({ meta }) => (meta.hasNextPage ? meta.page + 1 : undefined),
  });
};

const useCreateInvite = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiInvite, AxiosError<ApiError>, ApiCreateInviteDto & { organizationId: string }>({
    mutationKey: ['createInvite'],
    mutationFn: async data => {
      const { organizationId, ...body } = data;
      return (await client.inviteControllerCreateInvite(organizationId, body)).data;
    },
    onSuccess: (_, { organizationId: id }) => {
      queryClient.invalidateQueries({ queryKey: ['organizationInvites', { id }] });
    },
  });
};

const useAcceptInvite = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ApiError>, string>({
    mutationKey: ['acceptInvite'],
    mutationFn: async organizationId => {
      return (await client.inviteControllerAcceptInvite(organizationId)).data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['invites'] });
      queryClient.invalidateQueries({ queryKey: ['organizationInvites', { id }] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

const useDeclineInvite = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ApiError>, string>({
    mutationKey: ['declineInvite'],
    mutationFn: async organizationId => {
      return (await client.inviteControllerDeclineInvite(organizationId)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invites'] });
    },
  });
};

const useRevokeInvite = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ApiError>, { organizationId: string; email: string }>({
    mutationKey: ['deleteOrganization'],
    mutationFn: async ({ organizationId, email }) => {
      return (await client.inviteControllerRevokeInvite(organizationId, { email })).data;
    },
    onSuccess: async (_, { organizationId: id }) => {
      queryClient.invalidateQueries({ queryKey: ['organizationInvites', { id }] });
    },
  });
};

export { useAcceptInvite, useCreateInvite, useDeclineInvite, useInvites, useOrganizationInvites, useRevokeInvite, useInviteByHash };
