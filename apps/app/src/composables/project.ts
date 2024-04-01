import { ApiCreateProjectDto, ApiFullProject, ApiProject } from '@/services/api/data-contracts';
import { useAuthStore } from '@/stores/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { AxiosError } from 'axios';
import { storeToRefs } from 'pinia';
import { Ref, computed } from 'vue';
import { ApiError, client } from '../services/api-client';

const useProjects = () => {
  const authStore = useAuthStore();
  const { isAuthenticated } = storeToRefs(authStore);

  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => (await client.projectControllerGetProjects()).data,
    enabled: isAuthenticated,
  });
};

const useProject = (id: Ref<string>) => {
  const queryClient = useQueryClient();
  const authStore = useAuthStore();
  const { isAuthenticated } = storeToRefs(authStore);
  const enabled = computed(() => isAuthenticated.value && !!id.value);

  return useQuery<ApiFullProject, AxiosError<ApiError>>({
    queryKey: ['project', { id }],
    queryFn: async () => (await client.projectControllerGetProjectById(id.value)).data,
    enabled,
    placeholderData: () => {
      const foundProject = queryClient.getQueryData<ApiProject[]>(['projects'])?.find(x => x.id === id.value);

      if (!foundProject) {
        return;
      }

      return {
        ...foundProject,
        memberships: [],
        tools: [],
        organization: {
          id: foundProject.organizationId,
          name: '',
          createdAt: '',
          updatedAt: '',
        },
      };
    },
  });
};

const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiProject, AxiosError<ApiError>, ApiCreateProjectDto & { organizationId: string }>({
    mutationKey: ['createProject'],
    mutationFn: async data => {
      const { organizationId, ...rest } = data;
      return (await client.projectControllerCreateProject(organizationId, rest)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export { useCreateProject, useProject, useProjects };
