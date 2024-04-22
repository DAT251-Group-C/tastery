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
      path: '/signin',
      name: 'Sign in',
      component: () => import('@/views/auth/Signin.vue'),
      props: route => ({
        email: route.query.email,
      }),
    },
    {
      path: '/create',
      name: 'New recipe',
      component: () => import('@/views/recipe/CreateRecipe.vue'),
      meta: {
        authRequired: true,
      },
    },
    {
      path: '/profile',
      name: 'Your Profile',
      component: () => import('@/views/auth/Profile.vue'),
      meta: {
        authRequired: true,
      },
    },
    {
      path: '/recipe/:id',
      name: 'Recipe',
      component: () => import('@/views/recipe/Recipe.vue'),
      props: true,
    },
    {
      path: '/recipe/:id/edit',
      name: 'Edit Recipe',
      component: () => import('@/views/recipe/EditRecipe.vue'),
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
  document.title = title ? `${title} | Tastery` : 'Tastery';
});

export default router;
