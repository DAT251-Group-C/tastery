<template>
  <Suspense>
    <RouterView v-if="initialized"></RouterView>
    <div v-else class="w-[100vw] h-[100vh] flex items-center justify-center">
      <p>Loading...</p>
    </div>
  </Suspense>
  <Toast>
    <template #closeicon>
      <span class="font-symbol text-[1.25rem] w-5 h-5 shrink-0">close</span>
    </template>
    <template #icon="{ class: className }">
      <span class="font-symbol text-[1.25rem] w-5 h-5 shrink-0">{{ className }}</span>
    </template>
  </Toast>
  <ConfirmDialog />
</template>

<script setup lang="ts">
import ConfirmDialog from '@/components/templates/ConfirmDialog.vue';
import { supabase } from '@/plugins/supabase';
import { useAuthStore } from '@/stores/auth';
import { useColorMode } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import Toast from 'primevue/toast';
import { RouterView, useRouter, type RouteLocationRaw } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const { initialized } = storeToRefs(authStore);
useColorMode();

supabase.auth.onAuthStateChange(event => {
  if (event === 'SIGNED_IN') {
    authStore.loadSession().then(() => {
      if (authStore.isAuthenticated) {
        authStore.loadRedirectRoute();
      }
    });
  } else if (event === 'SIGNED_OUT') {
    authStore.clearSession();

    if (router.currentRoute.value.meta.authRequired) {
      router.push({ name: 'Index' });
    }
  }
});

authStore.$onAction(({ name, store, after }) => {
  if (name === 'loadRedirectRoute') {
    after(async () => {
      const redirectRoute = store.redirectRoute;

      await router.isReady();
      if (redirectRoute) {
        await router.push(redirectRoute as RouteLocationRaw);
        authStore.clearRedirectRoute();
      }
    });
  }
});
</script>
