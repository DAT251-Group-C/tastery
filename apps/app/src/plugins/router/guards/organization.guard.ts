import { useToaster } from '@/composables/toaster';
import { useOrganizationId } from '@/composables/tokens';
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export async function organizationGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
): Promise<void> {
  const { organizationId, setOrganizationId } = useOrganizationId();
  const toaster = useToaster();

  if (to.meta.organizationRequired && !organizationId.value) {
    let organizationIdFromParams = to.params.organizationId;
    let organizationIdFromQuery = to.query.organizationId;

    if (Array.isArray(organizationIdFromParams)) {
      organizationIdFromParams = organizationIdFromParams[0];
    }

    if (Array.isArray(organizationIdFromQuery)) {
      organizationIdFromQuery = organizationIdFromQuery[0];
    }

    if (organizationIdFromParams) {
      setOrganizationId(organizationIdFromParams);
      return next();
    } else if (organizationIdFromQuery) {
      setOrganizationId(organizationIdFromQuery);
      return next();
    }

    toaster.add({
      severity: 'info',
      summary: 'Organization required',
      detail: 'The page you tried to enter requires an organization to be selected',
    });
    next({ name: 'Projects' });
  } else {
    next();
  }
}
