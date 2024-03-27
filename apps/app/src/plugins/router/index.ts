import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from './guards/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Index',
      component: () => import('@/views/index/IndexView.vue'),
    },
    {
      path: '/signup',
      name: 'Sign up',
      component: () => import('@/views/auth/Auth.vue'),
      props: {
        mode: 'signup',
      },
    },
    {
      path: '/signin',
      name: 'Sign in',
      component: () => import('@/views/auth/Auth.vue'),
      props: {
        mode: 'signin',
      },
    },
    {
      path: '/platform',
      name: 'Platform',
      component: () => import('@/layout/Main.vue'),
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('@/views/platform/dashboard/Dashboard.vue'),
        },
        {
          path: 'organizations',
          name: 'Organizations',
          component: () => import('@/views/platform/organizations/Organizations.vue'),
        },
        {
          path: 'organizations/new',
          name: 'Create organization',
          component: () => import('@/views/platform/organizations/NewOrganization.vue'),
        },
        {
          path: 'projects',
          name: 'Projects',
          component: () => import('@/views/platform/projects/Projects.vue'),
        },
        {
          path: 'projects/new',
          name: 'Create project',
          component: () => import('@/views/platform/projects/NewProject.vue'),
        },
      ],
      meta: {
        authRequired: true,
      },
    },
  ],
});

router.beforeEach(authGuard);

export default router;
