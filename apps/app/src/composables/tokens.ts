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

  const setOrganizationId = async (id: string | null) => {
    organizationId.value = id;
    setProjectId(null);

    if (id === null && router.currentRoute.value.meta.organizationRequired) {
      router.push({ name: 'Projects' });
    }

    await queryClient.invalidateQueries({ queryKey: ['organizations'] });

    if (id) {
      await queryClient.invalidateQueries({ queryKey: ['organization', { id }] });
    }
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
      router.push({ name: 'Projects' });
    }

    queryClient.invalidateQueries({ queryKey: ['projects'] });

    if (id) {
      queryClient.invalidateQueries({ queryKey: ['project', { id }] });
    }
  };

  return { projectId, setProjectId };
};

export { ORGANIZATION_ID_QUERY_KEY, PROJECT_ID_QUERY_KEY, useOrganizationId, useProjectId };
