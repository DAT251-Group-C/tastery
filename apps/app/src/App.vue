<template>
  <Suspense>
    <RouterView v-if="initialized && (isAuthenticated ? !!user : true)"></RouterView>
    <div v-else class="w-[100vw] h-[100vh] flex items-center justify-center">
      <p>Loading...</p>
    </div>
  </Suspense>
</template>

<script setup lang="ts">
import { supabase } from '@/plugins/supabase';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { RouterView, useRouter, type RouteLocationRaw } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();

const { initialized, isAuthenticated } = storeToRefs(authStore);
const { user } = storeToRefs(userStore);

supabase.auth.onAuthStateChange(event => {
  if (event === 'SIGNED_IN') {
    authStore.loadSession();
    authStore.loadRedirectRoute();
    try {
      userStore.loadUser();
    } catch (err) {
      console.log('Error loading user:', err);
    }
  } else if (event === 'SIGNED_OUT') {
    authStore.clearSession();
    userStore.clearUser();
  }
});

authStore.$onAction(({ name, store, after }) => {
  if (name === 'loadRedirectRoute') {
    after(async () => {
      const redirectRoute = store.redirectRoute;

      if (redirectRoute) {
        await router.isReady();
        await router.replace(redirectRoute as RouteLocationRaw);
        authStore.clearRedirectRoute();
      }
    });
  }
});
</script>
