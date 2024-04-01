import { ApiFullMembership, ApiSortOrder, ApiUpdateMembershipRoleDto } from '@/services/api/data-contracts';
import { useAuthStore } from '@/stores/auth';
import { getValue } from '@/utils/vue';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { AxiosError } from 'axios';
import { storeToRefs } from 'pinia';
import { Ref } from 'vue';
import { ApiError, client } from '../services/api-client';
import { useUser } from './user';

const useOrganizationMemberships = (id: string | Ref<string>, order: ApiSortOrder = ApiSortOrder.DESC, take = 10) => {
  const authStore = useAuthStore();
  const { isAuthenticated } = storeToRefs(authStore);

  return useInfiniteQuery({
    queryKey: ['organizationMemberships', { id }],
    queryFn: async ({ pageParam: page }) =>
      (await client.membershipControllerGetMembershipsInOrganization(getValue(id), { page, order, take })).data,
    enabled: isAuthenticated,
    initialPageParam: 1,
    getNextPageParam: ({ meta }) => (meta.hasNextPage ? meta.page + 1 : undefined),
  });
};

const useMembership = (id: string | Ref<string>) => {
  const authStore = useAuthStore();
  const { isAuthenticated } = storeToRefs(authStore);

  return useQuery<ApiFullMembership, AxiosError<ApiError>>({
    queryKey: ['membership', { id }],
    queryFn: async () => (await client.membershipControllerGetMembership(getValue(id))).data,
    enabled: isAuthenticated,
  });
};

const useUpdateMembershipRole = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ApiError>, ApiUpdateMembershipRoleDto & { organizationId: string }>({
    mutationKey: ['updateMembershipRole'],
    mutationFn: async ({ organizationId: id, ...data }) => {
      return (await client.membershipControllerUpdateMembershipRole(id, data)).data;
    },
    onSuccess: async (_, { organizationId: id }) => {
      await queryClient.invalidateQueries({ queryKey: ['membership', { id }] });
      await queryClient.invalidateQueries({ queryKey: ['organizationMemberships', { id }] });
    },
  });
};

const useRemoveMembership = () => {
  const queryClient = useQueryClient();
  const { data: user } = useUser();

  return useMutation<void, AxiosError<ApiError>, { organizationId: string; userId: string }>({
    mutationKey: ['removeMembership'],
    mutationFn: async ({ organizationId, userId }) => {
      return (await client.membershipControllerRemoveMembership(organizationId, userId)).data;
    },
    onSuccess: async (_, { organizationId: id, userId }) => {
      await queryClient.invalidateQueries({ queryKey: ['organization', { id }] });
      await queryClient.invalidateQueries({ queryKey: ['organizationMemberships', { id }] });

      if (user.value?.id === userId) {
        await queryClient.invalidateQueries({ queryKey: ['memberships', { id }] });
        await queryClient.invalidateQueries({ queryKey: ['organizations'] });
      }
    },
  });
};

export { useMembership, useOrganizationMemberships, useRemoveMembership, useUpdateMembershipRole };
