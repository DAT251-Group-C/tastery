import { useToaster } from '@/composables/toaster';
import { useProjectId } from '@/composables/tokens';
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export async function projectGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): Promise<void> {
  const { projectId, setProjectId } = useProjectId();
  const toaster = useToaster();

  if (to.meta.projectRequired && !projectId.value) {
    let projectIdFromParams = to.params.projectId;
    let projectIdFromQuery = to.query.projectId;

    if (Array.isArray(projectIdFromParams)) {
      projectIdFromParams = projectIdFromParams[0];
    }

    if (Array.isArray(projectIdFromQuery)) {
      projectIdFromQuery = projectIdFromQuery[0];
    }

    if (projectIdFromParams) {
      setProjectId(projectIdFromParams);
      return next();
    } else if (projectIdFromQuery) {
      setProjectId(projectIdFromQuery);
      return next();
    }

    toaster.add({
      severity: 'info',
      summary: 'Project required',
      detail: 'The page you tried to enter requires a project to be selected',
    });
    next({ name: 'Projects' });
  } else {
    next();
  }
}
