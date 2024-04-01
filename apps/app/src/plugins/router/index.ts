import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from './guards/auth.guard';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Index',
      component: () => import('@/views/index/Index.vue'),
    },
    {
      path: '/signup',
      name: 'Sign up',
      component: () => import('@/views/auth/Signup.vue'),
      props: route => ({
        email: route.query.email,
      }),
    },
    {
      path: '/forgot-password',
      name: 'Forgot password',
      component: () => import('@/views/auth/ForgotPassword.vue'),
      props: route => ({
        email: route.query.email,
      }),
    },
    {
      path: '/invite',
      name: 'Invite',
      component: () => import('@/views/auth/Invite.vue'),
      props: route => ({ hash: route.query.hash }),
    },
    {
      path: '/signin',
      name: 'Sign in',
      component: () => import('@/views/auth/Signin.vue'),
      props: route => ({
        email: route.query.email,
      }),
    },
    {
      path: '/platform',
      redirect: '/platform/projects',
      component: () => import('@/components/templates/PlatformWrapper.vue'),
      children: [
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('@/views/platform/account/Profile.vue'),
          props: route => ({ passwordRecovery: route.query.passwordRecovery }),
          meta: {
            platformTitle: 'Account',
            platformSubtitle: 'Profile',
          },
        },
        {
          path: 'projects',
          name: 'Projects',
          component: () => import('@/views/platform/projects/Projects.vue'),
          meta: {
            platformTitle: 'Dashboard',
            platformSubtitle: 'Projects',
          },
        },
        {
          path: 'organizations/:organizationId',
          name: 'Organization',
          component: () => import('@/views/platform/organizations/Organization.vue'),
          meta: {
            platformTitle: 'Organization',
            platformSubtitle: 'Settings',
          },
          props: true,
        },
        {
          path: ':pathMatch(.*)*',
          name: 'Platform page not found',
          component: () => import('@/views/error/NotFound.vue'),
          meta: {
            title: 'Page not found',
            platformTitle: '404',
            platformSubtitle: 'Page not found',
          },
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
      },
    },
    {
      path: '/platform/projects/:projectId',
      component: () => import('@/components/templates/ProjectWrapper.vue'),
      children: [
        {
          path: '',
          name: 'Overview',
          component: () => import('@/views/platform/project/Overview.vue'),
        },
        {
          path: 'credentials',
          name: 'Credentials',
          component: () => import('@/views/platform/project/credentials/Credentials.vue'),
        },
        {
          path: 'credentials/new',
          name: 'New credential',
          component: () => import('@/views/platform/project/credentials/NewCredential.vue'),
        },
        {
          path: 'tools',
          name: 'Tools',
          component: () => import('@/views/platform/project/Tools.vue'),
        },
        {
          path: 'settings',
          name: 'Project settings',
          component: () => import('@/views/platform/project/Settings.vue'),
        },
        {
          path: ':pathMatch(.*)*',
          name: 'Project page not found',
          component: () => import('@/views/error/NotFound.vue'),
          meta: {
            title: 'Page not found',
          },
        },
      ],
      props: true,
      meta: {
        authRequired: true,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'Page not found',
      component: () => import('@/views/error/NotFound.vue'),
    },
  ],
});

router.beforeEach(authGuard);
router.beforeEach(to => {
  const title = String(to.meta?.title ?? to.name);
  document.title = title ? `${title} | Agient` : 'Agient';
});

export default router;
