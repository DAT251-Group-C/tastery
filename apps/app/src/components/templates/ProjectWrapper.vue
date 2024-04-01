<template>
  <div class="min-h-screen">
    <aside
      :class="[
        userMenu?.overlayVisible && 'w-52 menu-open',
        'fixed h-full flex flex-col overflow-hidden border-r z-40 border-neutral-700 w-14 hover:w-52 transition-[width] py-2 group bg-neutral-800',
      ]"
    >
      <Logo class="mb-1 mx-2" />
      <Menu :model="items" :fillHeight="true" class="!py-0 overflow-y-auto overflow-x-hidden">
        <template #item="{ item, props: itemProps }">
          <router-link v-slot="{ href, navigate, isActive, isExactActive }" :to="item.route" custom>
            <a
              :href="href"
              v-bind="itemProps.action"
              :class="(item.exact ? isExactActive : isActive) && 'rounded-xs bg-neutral-600 !text-neutral-200'"
              @click="navigate"
            >
              <i class="font-symbol">{{ item.icon }}</i>
              <span
                class="ml-3 opacity-0 group-hover:opacity-100 group-[:not(:hover)]:-translate-x-3 translate-x-0 group-[.menu-open]:opacity-100 transition-[opacity,transform] line-clamp-1"
              >
                {{ item.label }}
              </span>
            </a>
          </router-link>
        </template>
      </Menu>
      <hr class="border-neutral-700 mt-2" />
      <div
        class="flex items-center mt-3 mx-2 mb-2 transition py-0.5 rounded-xs cursor-pointer hover:bg-neutral-700"
        @click="userMenu?.toggle($event)"
      >
        <Avatar :label="user?.name[0] || '?'" class="mx-1 bg-primary !text-neutral-200" size="large" />
        <div
          class="ml-1 opacity-0 group-hover:opacity-100 group-[:not(:hover)]:-translate-x-3 translate-x-0 group-[.menu-open]:opacity-100 transition-[opacity,transform] min-w-0"
        >
          <p class="text-body-small text-neutral-300 truncate">{{ user?.name || 'Loading...' }}</p>
          <p class="text-caption text-neutral-500 truncate">{{ user?.email || 'Loading...' }}</p>
        </div>
      </div>

      <Menu ref="userMenu" :model="userMenuItems" :popup="true" class="bg-neutral-800 ring-1 ring-neutral-700" />
    </aside>
    <div class="ml-14">
      <Navbar>
        <p class="text-body">Agient</p>
      </Navbar>
      <main>
        <slot>
          <span v-if="isPending">Loading</span>
          <RouterView v-else :project="project"></RouterView>
        </slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUser } from '@/composables/user';
import { signOut } from '@/plugins/supabase';
import Avatar from 'primevue/avatar';
import Menu, { MenuState } from 'primevue/menu';
import type { MenuItem } from 'primevue/menuitem';
import { ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import Logo from '../atoms/Logo.vue';
import Navbar from './Navbar.vue';
import { useProject } from '@/composables/project';

const { data: user } = useUser();

const props = defineProps<{ projectId: string }>();
const { projectId } = toRefs(props);

const { data: project, isPending } = useProject(projectId);
const userMenu = ref<Menu & MenuState>();
const router = useRouter();

const userMenuItems: MenuItem[] = [
  {
    label: 'Profile',
    icon: 'account_circle',
    command: () => router.push('/platform/profile'),
  },
  {
    separator: true,
  },
  {
    label: 'Logout',
    icon: 'logout',
    command: async () => {
      await signOut();
      await router.push({ name: 'Index' });
    },
  },
];

const items: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'home',
    route: '/platform',
    exact: true,
  },
  {
    separator: true,
    class: '-mx-2',
  },
  {
    label: 'Credentials',
    icon: 'key',
    route: '/platform/credentials',
  },
  {
    label: 'Tools',
    icon: 'build',
    route: '/platform/credentials',
  },
  {
    label: 'Documentation',
    icon: 'description',
    route: '/docs',
    class: 'mt-auto',
  },
  {
    label: 'Project settings',
    icon: 'settings',
    route: projectId.value ? `/platform/projects/${projectId.value}/settings` : '',
  },
];
</script>
