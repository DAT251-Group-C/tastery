import { useToaster } from '@/composables/toaster';
import Router from '@/plugins/router';
import { useAuthStore } from '@/stores/auth';
import { AxiosError } from 'axios';
import { V1 } from './api/V1';
import { HttpClient } from './api/http-client';

export interface ApiError {
  message: string;
  statusCode: number;
  timestamp: string;
}

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

        const notify = (title: string, error: string | Error) => {
          const toaster = useToaster();

          let message = error;

          if (error instanceof AxiosError) {
            message = error.response?.data?.message ?? error.message;
          }

          if (error instanceof Error) {
            message = error.message;
          }

          toaster.add({
            severity: 'error',
            summary: title,
            detail: message,
          });
        };

        if (error.response.status === 401) {
          if (!originalRequest._retry) {
            originalRequest._retry = true;

            const refresh = async (): Promise<boolean> => {
              const authStore = useAuthStore();
              try {
                await authStore.loadSession();
                return authStore.currentSession !== null;
              } catch {
                return false;
              }
            };

            if (!(await refresh())) {
              notify('Authentication error', error);
              await Router.push({ name: 'Sign out' });
              return Promise.reject(error);
            }

            return instance(originalRequest);
          }
        }

        if (error.response.status >= 500) {
          notify('Internal server error', 'An error occurred on the server. We have been notified and will look into it!');
          await Router.push({ name: 'Server error' });
        }

        return Promise.reject(error);
      },
    );
  }
}

const client = new V1(new ApiHttpClient());

export { client };
