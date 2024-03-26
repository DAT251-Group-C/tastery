import type { ApiUpdateUserDto, ApiUserEntity } from '@/services/api/data-contracts';
import userService from '@/services/user';
import { defineStore } from 'pinia';

type State = {
  user: ApiUserEntity | null;
};

type Actions = {
  loadUser(): Promise<void>;
  clearUser(): void;
  updateUser(data: ApiUpdateUserDto): Promise<void>;
};

type Getters = Record<string, never>;

export const useUserStore = defineStore<'user', State, Getters, Actions>('user', {
  state: () => ({
    user: null,
  }),
  actions: {
    async loadUser() {
      this.user = (await userService.get()).data;
    },
    clearUser() {
      this.user = null;
    },
    async updateUser(data: ApiUpdateUserDto) {
      await userService.update(data);

      if (this.user) {
        this.user = {
          ...this.user,
          ...data,
        };
      }
    },
  },
});
