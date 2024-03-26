<template>
  <div class="min-h-screen">
    <aside
      class="fixed h-full flex flex-col overflow-hidden border-r z-40 border-neutral-700 w-14 hover:w-52 transition-[width] py-2 group bg-neutral-800"
    >
      <Menu :model="items" :fillHeight="true" class="!py-0 overflow-y-auto">
        <template #start>
          <!-- TODO: Logo -->
          <div class="h-10 w-10 mb-1 flex items-center justify-center">
            <span
              class="w-8 h-8 rounded-full bg-primary-dark text-neutral-100 flex items-center justify-center text-caption ring-1 ring-primary-light"
            >
              <span class="bg-primary-dark py-px px-0.5 rounded-xs ring-1 ring-primary-light italic">Agient</span>
            </span>
          </div>
        </template>
        <template #item="{ item, props }">
          <router-link v-slot="{ href, navigate, isActive, isExactActive }" :to="item.route" custom>
            <a
              :href="href"
              v-bind="props.action"
              :class="(item.exact ? isExactActive : isActive) && 'rounded-xs bg-neutral-600 !text-neutral-200'"
              @click="navigate"
            >
              <i class="font-symbol">{{ item.icon }}</i>
              <span class="ml-3 opacity-0 group-hover:opacity-100 transition-opacity">{{ item.label }}</span>
            </a>
          </router-link>
        </template>
        <template #end>
          <div v-if="user" class="flex items-center mt-1.5">
            <Avatar :label="user.name[0]" class="mx-1" size="large" />
            <div class="ml-1 opacity-0 group-hover:opacity-100 transition-opacity min-w-0">
              <p class="text-body-small-bold truncate">{{ user.name }}</p>
              <p class="text-caption text-neutral-500 truncate">{{ user.email }}</p>
            </div>
          </div>
        </template>
      </Menu>
    </aside>
    <div class="ml-14">
      <nav class="w-full bg-neutral-800 border-b border-neutral-700 py-2 px-5 h-12">
        <div class="flex items-center min-h-8">
          <p class="text-body">Agient</p>
        </div>
      </nav>
      <main>
        <RouterView></RouterView>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Menu from 'primevue/menu';
import { MenuItem } from 'primevue/menuitem';
import Avatar from 'primevue/avatar';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const items: MenuItem[] = [
  {
    label: 'Home',
    icon: 'home',
    route: '/platform',
    exact: true,
  },
  {
    separator: true,
  },
  {
    label: 'Organizations',
    icon: 'corporate_fare',
    route: '/platform/organizations',
  },
  {
    label: 'Projects',
    icon: 'view_list',
    route: '/platform/projects',
  },
  {
    label: 'Chatbots',
    icon: 'robot_2',
    route: '/platform/bots',
  },
  {
    label: 'Documentation',
    icon: 'description',
    route: '/platform/docs',
    class: 'mt-auto',
  },
  {
    label: 'Settings',
    icon: 'settings',
    route: '/platform/settings',
  },
];
</script>
