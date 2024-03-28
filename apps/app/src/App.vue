<template>
  <Suspense>
    <RouterView v-if="initialized"></RouterView>
    <div v-else class="w-[100vw] h-[100vh] flex items-center justify-center">
      <p>Loading...</p>
    </div>
  </Suspense>
</template>

<script setup lang="ts">
import { supabase } from '@/plugins/supabase';
import { useAuthStore } from '@/stores/auth';
import { useQueryClient } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';
import { RouterView, useRouter, type RouteLocationRaw } from 'vue-router';
import { useOrganizationId } from './composables/tokens';

const router = useRouter();
const authStore = useAuthStore();
const queryClient = useQueryClient();
const { setOrganizationId } = useOrganizationId();

const { initialized } = storeToRefs(authStore);

supabase.auth.onAuthStateChange(event => {
  if (event === 'SIGNED_IN') {
    authStore.loadSession();
    authStore.loadRedirectRoute();
    queryClient.invalidateQueries({ queryKey: ['auth'] });
  } else if (event === 'SIGNED_OUT') {
    authStore.clearSession();
    setOrganizationId(null);
    queryClient.invalidateQueries({ queryKey: ['auth'] });
    router.push({ name: 'Index' });
  }
});

authStore.$onAction(({ name, store, after }) => {
  if (name === 'loadRedirectRoute') {
    after(async () => {
      const redirectRoute = store.redirectRoute;

      await router.isReady();
      if (redirectRoute) {
        await router.replace(redirectRoute as RouteLocationRaw);
        authStore.clearRedirectRoute();
      }
    });
  }
});
</script>
