import { useProjectId } from '@/composables/tokens';
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export async function projectGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): Promise<void> {
  const { projectId } = useProjectId();

  if (to.meta.projectRequired && !projectId.value) {
    // TODO: Toaster
    next({ name: 'Dashboard' });
  } else {
    next();
  }
}
