import { useQueryClient } from '@tanstack/vue-query';
import { useStorage } from '@vueuse/core';

/**
 * Organization
 */
const ORGANIZATION_ID_QUERY_KEY = 'require-org-id';

const useOrganizationId = () => {
  const queryClient = useQueryClient();
  const { setProjectId } = useProjectId();
  const organizationId = useStorage<string | null>('organizationId', null);

  const setOrganizationId = (id: string | null) => {
    organizationId.value = id;
    if (id === null) {
      setProjectId(null);
    }
    queryClient.invalidateQueries({ queryKey: [ORGANIZATION_ID_QUERY_KEY] });
  };

  return { organizationId, setOrganizationId };
};

/**
 * Project
 */
const PROJECT_ID_QUERY_KEY = 'require-org-id';

const useProjectId = () => {
  const queryClient = useQueryClient();
  const projectId = useStorage<string | null>('projectId', null);

  const setProjectId = (id: string | null) => {
    projectId.value = id;
    queryClient.invalidateQueries({ queryKey: [ORGANIZATION_ID_QUERY_KEY] });
  };

  return { projectId, setProjectId };
};

export { ORGANIZATION_ID_QUERY_KEY, PROJECT_ID_QUERY_KEY, useOrganizationId, useProjectId };
