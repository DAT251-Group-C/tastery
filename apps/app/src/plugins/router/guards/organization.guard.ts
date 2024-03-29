import { useOrganizationId } from '@/composables/tokens';
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export async function organizationGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
): Promise<void> {
  const { organizationId } = useOrganizationId();

  if (to.meta.organizationRequired && !organizationId.value) {
    // TODO: Toaster
    next({ name: 'Dashboard' });
  } else {
    next();
  }
}
