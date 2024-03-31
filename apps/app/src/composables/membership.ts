import { ApiFullMembership, ApiSortOrder } from '@/services/api/data-contracts';
import { useAuthStore } from '@/stores/auth';
import { getValue } from '@/utils/vue';
import { useInfiniteQuery, useQuery } from '@tanstack/vue-query';
import { AxiosError } from 'axios';
import { storeToRefs } from 'pinia';
import { Ref } from 'vue';
import { ApiError, client } from '../services/api-client';

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

export { useMembership, useOrganizationMemberships };
