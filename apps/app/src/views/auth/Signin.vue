<template>
  <Auth>
    <h1 class="mt-8 mb-2 text-neutral-800">Welcome back</h1>
    <p class="text-body-small text-neutral-600 mb-10">Sign in to your account</p>
    <form class="flex flex-col gap-y-5" @submit.prevent="signIn">
      <Button severity="neutral" :label="'Continue with Google'" size="large" @click="signInWithGoogle()"></Button>
      <Divider><span class="bg-neutral-200 text-neutral-600 px-2">or</span></Divider>
      <div v-if="error" class="rounded-xs bg-error-dark ring-1 ring-error text-neutral-300 px-4 py-3 text-body-small">
        {{ error }}
      </div>
      <Control label="Email" hideDetails>
        <InputText v-model="emailModel" type="email" required placeholder="you@example.com" size="large" />
      </Control>
      <div class="relative">
        <RouterLink :to="{ name: 'Forgot password', query: { email: emailModel || undefined } }" tabindex="-1">
          <Button
            link
            class="!absolute -right-2 top-2.5 !text-caption self-end -mt-3 mb-0 !text-neutral-800 hover:!text-neutral-600"
            label="Forgot password?"
          ></Button>
        </RouterLink>
        <Control label="Password" hideDetails>
          <InputText v-model="passwordModel" required type="password" placeholder="••••••••" size="large" />
        </Control>
      </div>
      <Button type="submit" size="large" :disabled="isPending" :loading="isPending" loadingIcon="progress_activity">Sign In</Button>
    </form>
    <div class="text-caption text-neutral-600 mt-6">
      <p class="flex justify-center items-center">
        Don't have an account?
        <RouterLink :to="{ name: 'Sign up', query: { hash } }" tabindex="-1">
          <Button link class="!text-caption !px-1 !text-neutral-800 hover:!text-neutral-600" label="Sign up now"></Button>
        </RouterLink>
      </p>
    </div>
  </Auth>
</template>

<script setup lang="ts">
import Control from '@/components/atoms/Control.vue';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import InputText from 'primevue/inputtext';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../../plugins/supabase';
import Auth from './Auth.vue';

const props = defineProps<{ email?: string; hash?: string }>();
const router = useRouter();
const emailModel = ref(props.email ?? '');
const passwordModel = ref('');
const error = ref('');
const isPending = ref(false);

const signIn = async () => {
  error.value = '';
  isPending.value = true;

  const response = await supabase.auth.signInWithPassword({
    email: emailModel.value,
    password: passwordModel.value,
  });

  if (response.error) {
    error.value = response.error.message;
  } else {
    router.push({ name: 'Index' });
  }

  isPending.value = false;
};

const signInWithGoogle = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
};
</script>
