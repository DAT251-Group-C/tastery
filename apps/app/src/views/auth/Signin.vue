<template>
  <Auth>
    <h1 class="mt-8 mb-2 text-neutral-100">Welcome back</h1>
    <p class="text-body-small text-neutral-400 mb-10">Sign in to your account</p>
    <form class="flex flex-col gap-y-5" @submit.prevent="signIn">
      <Button severity="neutral" :label="'Continue with Github'" size="large" @click="signInWithGithub()"></Button>
      <Button severity="neutral" :label="'Continue with Google'" size="large"></Button>
      <Divider><span class="bg-neutral-800 text-neutral-300 px-2">or</span></Divider>
      <Control label="Email" size="large">
        <InputText v-model="email" required placeholder="you@example.com" size="large" />
      </Control>
      <div class="relative">
        <Button link class="!absolute -right-2 top-2.5 !text-caption self-end -mt-3 mb-0" label="Forgot password?"></Button>
        <Control label="Password" size="large">
          <InputText v-model="password" required type="password" placeholder="••••••••" size="large" />
        </Control>
      </div>
      <Button type="submit" size="large">Sign In</Button>
    </form>
    <div class="text-caption text-neutral-400 mt-6">
      <p class="flex justify-center items-center">
        Don't have an account?
        <RouterLink to="/signup" tabindex="-1">
          <Button link class="!text-caption" label="Sign up now"></Button>
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

const router = useRouter();
const email = ref('eirik.maaseidvaag@gmail.com');
const password = ref('password123');

const signIn = async () => {
  const response = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (response.error) {
    console.error('Error signing in:', response.error.message);
  } else {
    console.log('User signed in:', response.data);
    router.push({ name: 'Projects' });
  }
};

const signInWithGithub = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'github',
  });
};
</script>
