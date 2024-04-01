import { useAuthStore } from '@/stores/auth';
import { getValue } from '@/utils/vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { AxiosError } from 'axios';
import { storeToRefs } from 'pinia';
import { Ref, computed } from 'vue';
import { ApiError, client } from '../services/api-client';
import { ApiCreateOrganizationDto, ApiFullOrganization, ApiOrganization, ApiUpdateOrganizationDto } from '../services/api/data-contracts';

const useOrganizations = () => {
  const authStore = useAuthStore();
  const { isAuthenticated } = storeToRefs(authStore);

  const query = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => (await client.organizationControllerGetOrganizations()).data,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

  const organizations = computed(() => {
    return query.data.value ?? [];
  });

  return { ...query, organizations };
};

const useOrganization = (id: string | Ref<string>) => {
  const queryClient = useQueryClient();
  const authStore = useAuthStore();
  const { isAuthenticated } = storeToRefs(authStore);

  return useQuery<ApiFullOrganization, AxiosError<ApiError>>({
    queryKey: ['organization', { id }],
    queryFn: async () => (await client.organizationControllerGetOrganizationById(getValue(id))).data,
    enabled: isAuthenticated,
    placeholderData: () => {
      return queryClient.getQueryData<ApiFullOrganization[]>(['organizations'])?.find(x => x.id === getValue(id));
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

const useUpdateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ApiError>, ApiUpdateOrganizationDto & { organizationId: string }>({
    mutationKey: ['updateOrganization'],
    mutationFn: async data => {
      const { organizationId, ...rest } = data;
      return (await client.organizationControllerUpdateOrganization(organizationId, rest)).data;
    },
    onSuccess: async (_, { organizationId: id }) => {
      await queryClient.invalidateQueries({ queryKey: ['organization', { id }] });
      await queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
};

const useDeleteOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ApiError>, string>({
    mutationKey: ['deleteOrganization'],
    mutationFn: async id => {
      return (await client.organizationControllerDeleteOrganization(id)).data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
};

export { useCreateOrganization, useDeleteOrganization, useOrganization, useOrganizations, useUpdateOrganization };
