import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { AxiosError } from 'axios';
import { Ref, computed } from 'vue';
import { ApiError, client } from '../services/api-client';
import { ApiCreateOrganizationDto, ApiFullOrganization, ApiOrganization } from '../services/api/data-contracts';
import { ORGANIZATION_ID_QUERY_KEY } from './tokens';

export const USE_ORGANIZATIONS_QUERY_KEY = ['organizations', 'auth', ORGANIZATION_ID_QUERY_KEY];

const useOrganizations = () => {
  const query = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      console.log('query!');
      return (await client.organizationControllerGetOrganizations()).data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const organizations = computed(() => {
    return query.data.value ?? [];
  });

  return { ...query, organizations };
};

const useOrganization = (id: Ref<string>) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['organization', { id }],
    queryFn: async () => {
      return (await client.organizationControllerGetOrganizationById(id.value)).data;
    },
    placeholderData: () => {
      return queryClient.getQueryData<ApiFullOrganization[]>(['organizations'])?.find(x => x.id === id.value);
    },
  });
};

const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiOrganization, AxiosError<ApiError>, ApiCreateOrganizationDto>({
    mutationKey: ['createOrganization'],
    mutationFn: async (data: ApiCreateOrganizationDto) => {
      return (await client.organizationControllerCreateOrganization(data)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
};

export { useCreateOrganization, useOrganization, useOrganizations };
