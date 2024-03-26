import Router from '@/plugins/router';
import { useAuthStore } from '@/stores/auth';
import { V1 } from './api/V1';
import { HttpClient } from './api/http-client';

class ApiHttpClient extends HttpClient {
  constructor() {
    super({ baseURL: `${import.meta.env.VITE_REST_API_URL}` });
    const instance = this.instance;
    instance.interceptors.request.use(
      async config => {
        const authStore = useAuthStore();

        if (!authStore.currentSession) {
          await authStore.loadSession();
        }

        config.headers.Authorization = `Bearer ${authStore.currentSession?.access_token}`;
        return config;
      },
      error => {
        Promise.reject(error);
      },
    );

    instance.interceptors.response.use(
      response => {
        return response;
      },
      async error => {
        const originalRequest = error.config;
        if (error.response.status === 401) {
          if (!originalRequest._retry) {
            originalRequest._retry = true;

            const refresh = async (): Promise<boolean> => {
              const authStore = useAuthStore();
              try {
                await authStore.loadSession(false);
                return authStore.currentSession !== null;
              } catch {
                return false;
              }
            };

            if (!(await refresh())) {
              // TODO: Notification?
              await Router.push({ name: 'Sign out' });
              return Promise.reject(error);
            }

            return instance(originalRequest);
          }
        }

        if (error.response.status >= 500) {
          await Router.push({ name: 'Server error' });
        }

        return Promise.reject(error);
      },
    );
  }
}

const client = new V1(new ApiHttpClient());

export { client };
