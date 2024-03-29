import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { computed } from 'vue';
import { client } from '../services/api-client';
import { ApiCreateOrganizationDto } from '../services/api/data-contracts';
import { ORGANIZATION_ID_QUERY_KEY } from './tokens';

const useOrganizations = () => {
  const res = useInfiniteQuery({
    queryKey: ['organizations', 'auth', ORGANIZATION_ID_QUERY_KEY],
    queryFn: async ({ pageParam }) => {
      return (await client.organizationControllerGetOrganizations({ page: pageParam, take: 1 })).data;
    },
    initialPageParam: 1,
    getNextPageParam: ({ meta }) => (meta.hasNextPage ? meta.page + 1 : undefined),
    staleTime: Infinity,
  });

  return { ...res, items: computed(() => res.data.value?.pages.flatMap(page => page.data) ?? []) };
};

const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['createOrganization'],
    mutationFn: async (data: ApiCreateOrganizationDto) => {
      return (await client.organizationControllerCreateOrganization(data)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
};

export { useCreateOrganization, useOrganizations };
