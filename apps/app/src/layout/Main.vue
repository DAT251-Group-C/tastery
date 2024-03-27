<template>
  <div class="min-h-screen">
    <aside
      :class="[
        userMenu?.overlayVisible && 'w-52 menu-open',
        'fixed h-full flex flex-col overflow-hidden border-r z-40 border-neutral-700 w-14 hover:w-52 transition-[width] py-2 group bg-neutral-800',
      ]"
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
              <span class="ml-3 opacity-0 group-hover:opacity-100 group-[.menu-open]:opacity-100 transition-opacity">{{ item.label }}</span>
            </a>
          </router-link>
        </template>
        <template #end>
          <div
            v-if="user"
            class="flex items-center mt-3 mb-2 transition py-0.5 rounded-xs cursor-pointer hover:bg-neutral-700"
            @click="userMenu?.toggle($event)"
          >
            <Avatar :label="user.name[0]" class="mx-1 bg-primary !text-neutral-200" size="large" />
            <div class="ml-1 opacity-0 group-hover:opacity-100 group-[.menu-open]:opacity-100 transition-opacity min-w-0">
              <p class="text-body-small-bold text-neutral-300 truncate">{{ user.name }}</p>
              <p class="text-caption text-neutral-500 truncate">{{ user.email }}</p>
            </div>
          </div>

          <Menu ref="userMenu" :model="userMenuItems" :popup="true" class="bg-neutral-800 ring-1 ring-neutral-700">
            <template #item="{ item, props }">
              <a class="flex align-items-center" v-bind="props.action">
                <span v-if="item.icon" class="font-symbol mr-2">{{ item.icon }}</span>
                <span>{{ item.label }}</span>
              </a>
            </template>
          </Menu>
        </template>
      </Menu>
    </aside>
    <div class="ml-14">
      <nav class="w-full bg-primary-800 border-b border-neutral-700 py-2 px-5 h-12">
        <div class="flex gap-x-4 items-center h-8">
          <p class="text-body">Agient</p>

          <Button
            size="small"
            severity="contrast"
            :label="organizationsLabel"
            aria-haspopup="true"
            aria-controls="overlay_menu"
            @click="!organizationsLoading && organizationMenu?.toggle($event)"
          >
            <template #icon>
              <i class="font-symbol order-1 ml-2">expand_more</i>
            </template>
          </Button>

          <Button
            v-if="organizationId"
            size="small"
            severity="contrast"
            :label="projectsLabel"
            aria-haspopup="true"
            aria-controls="overlay_menu"
            @click="!projectsLoading && projectMenu?.toggle($event)"
          >
            <template #icon>
              <i class="font-symbol order-1 ml-2">expand_more</i>
            </template>
          </Button>

          <Menu ref="projectMenu" :model="projectItems" :popup="true" class="bg-neutral-800 ring-1 ring-neutral-700">
            <template #item="{ item, props }">
              <a class="flex align-items-center" v-bind="props.action">
                <span v-if="item.icon" class="font-symbol mr-2">{{ item.icon }}</span>
                <span>{{ item.label }}</span>
              </a>
            </template>
          </Menu>

          <Menu ref="organizationMenu" :model="organizationItems" :popup="true" class="bg-neutral-800 ring-1 ring-neutral-700">
            <template #item="{ item, props }">
              <a class="flex align-items-center" v-bind="props.action">
                <span v-if="item.icon" class="font-symbol mr-2">{{ item.icon }}</span>
                <span>{{ item.label }}</span>
              </a>
            </template>
          </Menu>
        </div>
      </nav>
      <main>
        <RouterView></RouterView>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOrganizations } from '@/composables/organization';
import { useProjects } from '@/composables/project';
import { useOrganizationId, useProjectId } from '@/composables/tokens';
import { useUser } from '@/composables/user';
import { supabase } from '@/plugins/supabase';
import { ApiOrganizationEntity, ApiProjectEntity } from '@/services/api/data-contracts';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Menu, { MenuState } from 'primevue/menu';
import { MenuItem } from 'primevue/menuitem';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const { data: user } = useUser();
const { data: projects, isLoading: projectsLoading } = useProjects();
const { data: organizations, isLoading: organizationsLoading } = useOrganizations();

const projectMenu = ref<Menu>();
const organizationMenu = ref<Menu>();
const userMenu = ref<Menu & MenuState>();
const router = useRouter();
const { projectId, setProjectId } = useProjectId();
const { organizationId, setOrganizationId } = useOrganizationId();

const mapOrganization = (organization: ApiOrganizationEntity): MenuItem => ({
  label: organization.name,
  command: () => setOrganizationId(organization.id),
});

const organizationsLabel = computed(() => {
  const currentOrganization = organizations.value?.find(p => p.id === organizationId.value);
  return currentOrganization ? currentOrganization.name : organizationsLoading.value ? 'Loading...' : 'Select organization';
});

const projectsLabel = computed(() => {
  const currentProject = projects.value?.find(p => p.id === projectId.value);
  return currentProject ? currentProject.name : projectsLoading.value ? 'Loading...' : 'Select project';
});

const organizationItems = computed<MenuItem[]>(() => {
  return [
    ...(organizations.value && organizations.value.length > 0
      ? organizations.value.map(mapOrganization)
      : [{ label: 'You have no organizations', disabled: true }]),
    {
      separator: true,
    },
    {
      label: 'New organization',
      icon: 'add',
      command: () => router.push('/platform/organizations/new'),
    },
  ];
});

const mapProject = (project: ApiProjectEntity): MenuItem => ({
  label: project.name,
  command: () => setProjectId(project.id),
});

const projectItems = computed<MenuItem[]>(() => [
  ...(projects.value && projects.value.length > 0 ? projects.value.map(mapProject) : [{ label: 'You have no projects', disabled: true }]),
  {
    separator: true,
  },
  {
    label: 'New project',
    icon: 'add',
    command: () => {
      router.push('/platform/projects/new');
    },
  },
]);

const userMenuItems: MenuItem[] = [
  {
    label: 'Profile',
    icon: 'person',
  },
  {
    label: 'Preferences',
    icon: 'settings',
  },
  {
    separator: true,
  },
  {
    label: 'Logout',
    icon: 'logout',
    command: () => supabase.auth.signOut({ scope: 'local' }),
  },
];

const items: MenuItem[] = [
  {
    label: 'Home',
    icon: 'home',
    route: '/platform',
    exact: true,
  },
  {
    separator: true,
    class: '-mx-2',
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
    separator: true,
    class: '-mx-2',
  },
  {
    label: 'Chatbots',
    icon: 'robot_2',
    route: '/platform/bots',
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
    route: '/platform/docs',
    class: 'mt-auto',
  },
  {
    label: 'Settings',
    icon: 'settings',
    route: '/platform/settings',
  },
  {
    separator: true,
    class: '-mx-2',
  },
];
</script>
