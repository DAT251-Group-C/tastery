import { ApiCreateProjectDto, ApiProject } from '@/services/api/data-contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { AxiosError } from 'axios';
import { ApiError, client } from '../services/api-client';
import { Ref } from 'vue';

const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      return (await client.projectControllerGetProjects()).data;
    },
  });
};

const useProject = (id: Ref<string>) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['project', { id }],
    queryFn: async () => {
      return (await client.projectControllerGetProjectById(id.value)).data;
    },
    placeholderData: () => {
      const foundProject = queryClient.getQueryData<ApiProject[]>(['projects'])?.find(x => x.id === id.value);

      if (!foundProject) {
        return;
      }

      return {
        ...foundProject,
        organization: {},
        memberships: [],
        tools: [],
        credentials: [],
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

export { useCreateProject, useProjects, useProject };
