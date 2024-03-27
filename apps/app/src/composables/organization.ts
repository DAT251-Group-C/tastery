import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { client } from '../services/api-client';
import { ApiCreateOrganizationDto } from '../services/api/data-contracts';
import { ORGANIZATION_ID_QUERY_KEY } from './tokens';

const useOrganizations = () => {
  return useQuery({
    queryKey: ['organizations', ORGANIZATION_ID_QUERY_KEY],
    queryFn: async () => {
      return (await client.organizationControllerGetOrganizations()).data;
    },
    staleTime: 1000 * 60 * 5,
  });
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
