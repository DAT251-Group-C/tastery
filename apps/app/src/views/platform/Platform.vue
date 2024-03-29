<template>
  <div class="min-h-screen">
    <aside class="fixed h-full flex flex-col overflow-hidden border-r z-40 border-neutral-700 w-64 pb-2 bg-neutral-900">
      <div class="px-6">
        <!-- Page title -->
        <div class="h-12">
          <h1 class="text-body-large h-full flex items-center">{{ currentPageTitle }}</h1>
          <hr class="-mx-6 -mt-px border-neutral-700" />
        </div>

        <template v-for="section in items" :key="section.label">
          <div class="flex flex-col gap-y-2 py-5">
            <p class="text-body-small text-neutral-500">{{ section.label }}</p>

            <template v-for="link in section.items" :key="link.label">
              <RouterLink v-if="link.to" v-slot="{ isActive }" :to="link.to">
                <a
                  :class="[
                    'flex text-body-small-bold transition-colors hover:text-neutral-300',
                    isActive ? 'text-neutral-300' : 'text-neutral-400',
                  ]"
                >
                  {{ link.label }}
                </a>
              </RouterLink>
              <button
                v-else-if="link.click"
                class="text-left text-body-small-bold text-neutral-400 hover:text-neutral-300"
                @click="link.click()"
              >
                {{ link.label }}
              </button>
              <p v-else class="text-body-small text-neutral-400">{{ link.label }}</p>
            </template>
          </div>
          <hr class="-mx-6 border-neutral-700" />
        </template>

        <div class="flex flex-col gap-y-2 py-5">
          <button class="flex items-center text-left text-body-small-bold text-neutral-400 hover:text-neutral-300" @click="signOut()">
            <i class="font-symbol text-body">logout</i>
            <span class="ml-2">Log out</span>
          </button>
        </div>
        <hr class="-mx-6 border-neutral-700" />
      </div>
    </aside>
    <div class="ml-64">
      <nav class="w-full bg-primary-800 border-b border-neutral-700 py-2 px-5 h-12">
        <div class="flex gap-x-4 items-center h-8">
          <p class="text-body-small text-neutral-400">Projects</p>
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
import { signOut } from '@/plugins/supabase';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentPageTitle = computed(() => router.currentRoute.value.name);
const { items: organizations, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage } = useOrganizations();

const organizationItems = computed(() => {
  const items = organizations.value.map<Item>(org => ({
    label: org.name,
    to: `/platform/organizations/${org.id}`,
  }));

  if (isFetchingNextPage.value) {
    items.push({
      label: 'Loading...',
    });
  } else if (hasNextPage.value) {
    items.push({
      label: 'Load more',
      click: fetchNextPage,
    });
  }

  return items;
});

interface Item {
  label: string;
  to?: string;
  click?: () => void;
  items?: Item[];
}

const items = computed<Item[]>(() => [
  {
    label: 'Projects',
    items: [
      {
        label: 'All projects',
        to: '/platform',
      },
    ],
  },
  ...(isFetching.value
    ? []
    : [
        {
          label: 'Organizations',
          items: [...organizationItems.value],
        },
      ]),
  {
    label: 'Account',
    items: [
      {
        label: 'Profile',
        to: '/platform/profile',
      },
    ],
  },
]);
</script>
