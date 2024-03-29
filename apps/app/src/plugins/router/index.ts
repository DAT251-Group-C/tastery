import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from './guards/auth.guard';
import { organizationGuard } from './guards/organization.guard';
import { projectGuard } from './guards/project.guard';

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
      component: () => import('@/views/auth/Signup.vue'),
      props: {
        mode: 'signup',
      },
    },
    {
      path: '/signin',
      name: 'Sign in',
      component: () => import('@/views/auth/Signin.vue'),
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
        {
          path: 'projects/:projectId',
          name: 'Project',
          component: () => import('@/views/platform/projects/Project.vue'),
          meta: {
            organizationRequired: true,
            projectRequired: true,
          },
        },
      ],
      meta: {
        authRequired: true,
      },
    },
  ],
});

router.beforeEach(authGuard);
router.beforeEach(organizationGuard);
router.beforeEach(projectGuard);

export default router;
