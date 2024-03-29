import { useQueryClient } from '@tanstack/vue-query';
import { useStorage } from '@vueuse/core';
import { useRouter } from 'vue-router';

/**
 * Organization
 */
const ORGANIZATION_ID_QUERY_KEY = 'require-org-id';

const useOrganizationId = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const organizationId = useStorage<string | null>('organizationId', null);
  const { setProjectId } = useProjectId();

  const setOrganizationId = (id: string | null) => {
    organizationId.value = id;
    if (id === null) {
      setProjectId(null);

      if (router.currentRoute.value.meta.organizationRequired) {
        router.push({ name: 'Dashboard' });
      }
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
  const router = useRouter();
  const projectId = useStorage<string | null>('projectId', null);

  const setProjectId = (id: string | null) => {
    projectId.value = id;

    if (id === null && router.currentRoute.value.meta.projectRequired) {
      router.push({ name: 'Dashboard' });
    }

    queryClient.invalidateQueries({ queryKey: [ORGANIZATION_ID_QUERY_KEY] });
  };

  return { projectId, setProjectId };
};

export { ORGANIZATION_ID_QUERY_KEY, PROJECT_ID_QUERY_KEY, useOrganizationId, useProjectId };
