<template>
  <nav class="w-full grid grid-cols-[1fr,_auto] gap-x-4 items-center bg-primary-800 border-b border-neutral-300 py-2 px-5 h-12">
    <div class="flex gap-x-4 items-center h-8">
      <p class="text-primary-dark text-body-small">Tastery</p>
      <slot></slot>
    </div>
    <div class="flex gap-x-4 items-center h-8">
      <RouterLink v-if="!isAuthenticated" to="/signin">
        <Button label="Sign in"></Button>
      </RouterLink>
      <RouterLink v-else-if="user" to="/profile">
        <Avatar size="large">{{ user.name[0] }}</Avatar>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useUser } from '@/composables/user';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);

const { data: user } = useUser();
</script>
