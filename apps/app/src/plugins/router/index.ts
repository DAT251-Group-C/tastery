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
      redirect: '/platform/projects',
      component: () => import('@/components/templates/PlatformWrapper.vue'),
      children: [
        {
          path: '/platform/profile',
          name: 'Profile',
          component: () => import('@/views/platform/account/Profile.vue'),
          meta: {
            platformTitle: 'Account',
            platformSubtitle: 'Profile',
          },
        },
        {
          path: '/platform/projects',
          name: 'Projects',
          component: () => import('@/views/platform/projects/Projects.vue'),
          meta: {
            platformTitle: 'Dashboard',
            platformSubtitle: 'Projects',
          },
        },
        {
          path: '/platform/organizations/:organizationId',
          name: 'Organization',
          component: () => import('@/views/platform/organizations/Organization.vue'),
          meta: {
            organizationRequired: true,
            platformTitle: 'Organization',
            platformSubtitle: 'Settings',
          },
          props: true,
        },
      ],
      meta: {
        authRequired: true,
      },
    },
    {
      path: '/platform/organizations/new',
      name: 'Create organization',
      component: () => import('@/views/platform/organizations/NewOrganization.vue'),
      meta: {
        authRequired: true,
      },
    },
    {
      path: '/platform/projects/new',
      name: 'Create project',
      component: () => import('@/views/platform/projects/NewProject.vue'),
      meta: {
        authRequired: true,
        organizationRequired: true,
      },
    },
    {
      path: '/platform/projects/:projectId',
      component: () => import('@/components/templates/ProjectWrapper.vue'),
      children: [
        {
          path: '',
          name: 'Project',
          component: () => import('@/views/platform/projects/Project.vue'),
        },
      ],
      meta: {
        authRequired: true,
        organizationRequired: true,
        projectRequired: true,
      },
    },
  ],
});

router.beforeEach(authGuard);
router.beforeEach(organizationGuard);
router.beforeEach(projectGuard);
router.beforeEach(to => {
  const title = String(to.meta?.title ?? to.name);
  document.title = title ? `${title} | Agient` : 'Agient';
});

export default router;
