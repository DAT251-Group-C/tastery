import { ApiCreateProjectDto } from '@/services/api/data-contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { client } from '../services/api-client';
import { PROJECT_ID_QUERY_KEY, useOrganizationId } from './tokens';

const useProjects = () => {
  return useQuery({
    queryKey: ['projects', 'auth', PROJECT_ID_QUERY_KEY],
    queryFn: async () => {
      return (await client.projectControllerGetProjects()).data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { organizationId } = useOrganizationId();

  return useMutation({
    mutationKey: ['createProject'],
    mutationFn: async (data: ApiCreateProjectDto) => {
      if (!organizationId.value) {
        throw new Error('Organization ID is required');
      }

      return (await client.projectControllerCreateProject(organizationId.value, data)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export { useCreateProject, useProjects };
