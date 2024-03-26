import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { client } from '../../services/api-client';
import { ApiCreateOrganizationDto } from '../../services/api/data-contracts';

const useOrganizations = () => {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      return (await client.organizationControllerGetOrganizations()).data;
    },
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
