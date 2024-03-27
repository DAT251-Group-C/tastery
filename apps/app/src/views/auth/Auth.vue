<template>
  <div class="min-h-screen flex flex-col">
    <div class="flex flex-col flex-1 bg-neutral-900">
      <div class="flex flex-1">
        <main class="flex flex-col items-center flex-1 flex-shrink-0 px-5 pt-16 pb-8 border-r border-neutral-700 shadow-lg bg-neutral-800">
          <div class="flex-1 flex flex-col justify-center w-[330px] sm:w-[384px]">
            <div class="mb-10">
              <h1 class="mt-8 mb-2 text-neutral-100">Welcome back</h1>
              <p class="text-body-bold text-neutral-400">Sign in to your account</p>
            </div>
            <form v-if="mode === 'signin'" class="flex flex-col gap-y-4" @submit.prevent="signin">
              <InputText v-model="email" required placeholder="Email" />
              <InputText v-model="password" required type="password" placeholder="Password" />
              <Button type="submit">Sign In</Button>
            </form>
            <form v-if="mode === 'signup'" class="flex flex-col gap-y-4" @submit.prevent="signup">
              <InputText v-model="firstName" required placeholder="First name" />
              <InputText v-model="lastName" required placeholder="Last name" />
              <InputText v-model="email" required placeholder="Email" />
              <InputText v-model="password" required type="password" placeholder="Password" />
              <Button type="submit">Sign Up</Button>
            </form>
            <div class="text-body-small text-neutral-400 mt-6">
              <p v-if="mode === 'signup'" class="flex justify-center items-center">
                Already have an account?
                <RouterLink to="/signin">
                  <Button link class="!text-body-small" label="Sign in now"></Button>
                </RouterLink>
              </p>
              <p v-else class="flex justify-center items-center">
                Don't have an account?
                <RouterLink to="/signup">
                  <Button link class="!text-body-small" label="Sign up now"></Button>
                </RouterLink>
              </p>
            </div>
          </div>
        </main>
        <aside class="flex-col items-center justify-center flex-1 flex-shrink hidden basis-1/4 xl:flex">
          <h1 class="text-neutral-300 max-w-lg">
            This is where I'll write good stuff about Agient once I've gotten a bit further ahead 😍
          </h1>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../../plugins/supabase';

const { mode } = withDefaults(defineProps<{ mode: 'signup' | 'signin' }>(), { mode: 'signup' });

const router = useRouter();
const firstName = ref('');
const lastName = ref('');
const email = ref('eirik.maaseidvaag@gmail.com');
const password = ref('password123');

const signup = async () => {
  const response = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        firstName: firstName.value,
        lastName: lastName.value,
      },
    },
  });

  if (response.error) {
    console.error('Error signing up:', response.error.message);
  } else {
    console.log('User signed up:', response.data.user);
    router.push({ name: 'Dashboard' });
  }
};

const signin = async () => {
  const response = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (response.error) {
    console.error('Error signing in:', response.error.message);
  } else {
    console.log('User signed in:', response.data);
    router.push({ name: 'Dashboard' });
  }
};
</script>
