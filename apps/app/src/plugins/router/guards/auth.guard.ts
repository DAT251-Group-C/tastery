import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

export async function authGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): Promise<void> {
  const authStore = useAuthStore();
  const isAuth = await isAuthenticated();

  if (to.meta.authRequired && !isAuth) {
    authStore.saveRedirectRoute(to);
    next({ name: 'Index' });
  } else if (['Sign up', 'Sign in'].includes(to.name?.toString() ?? '') && isAuth) {
    next({ name: 'Index' });
  } else {
    next();
  }
}

const isAuthenticated = async (): Promise<boolean> => {
  const authStore = useAuthStore();
  const currentPromise = authStore.currentPromise || authStore.loadSession();
  await currentPromise;
  return authStore.isAuthenticated;
};
