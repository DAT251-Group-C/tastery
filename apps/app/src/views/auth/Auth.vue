<template>
  <div class="min-h-screen flex flex-col">
    <div class="flex flex-col flex-1 bg-slate-900">
      <div class="flex flex-1">
        <main class="flex flex-col items-center flex-1 flex-shrink-0 px-5 pt-16 pb-8 border-r border-slate-700 shadow-lg bg-slate-800">
          <div class="flex-1 flex flex-col justify-center w-[330px] sm:w-[384px]">
            <div class="mb-10">
              <h1 class="mt-8 mb-2 text-3xl text-slate-100">Welcome back</h1>
              <h2 class="text-sm text-slate-100">Sign in to your account</h2>
            </div>
            <form v-if="mode === 'signin'" class="flex flex-col gap-y-4" @submit.prevent="signin">
              <InputText v-model="email" required placeholder="Email" />
              <InputText v-model="password" required type="password" placeholder="Password" />
              <Button class="bg-slate-500 w-full">Sign In</Button>
            </form>
            <form v-if="mode === 'signup'" class="flex flex-col gap-y-4" @submit.prevent="signup">
              <InputText v-model="firstName" required placeholder="First name" />
              <InputText v-model="lastName" required placeholder="Last name" />
              <InputText v-model="email" required placeholder="Email" />
              <InputText v-model="password" required type="password" placeholder="Password" />
              <Button type="submit" class="bg-slate-500 w-full">Sign Up</Button>
            </form>
            <div class="text-center text-slate-100 mt-4 text-sm">
              <p v-if="mode === 'signup'">
                Already have an account? <RouterLink to="/signin" class="text-blue-400">Sign in now</RouterLink>
              </p>
              <p v-else>Don't have an account? <RouterLink to="/signup" class="text-blue-400">Sign up now</RouterLink></p>
            </div>
          </div>
        </main>
        <aside class="flex-col items-center justify-center flex-1 flex-shrink hidden basis-1/4 xl:flex">
          <h1 class="text-slate-100 text-3xl max-w-lg">
            This is where i will write good stuff about the chatbot once ive gotten a bit further ahead 😍
          </h1>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { ref } from 'vue';
import { supabase } from '../../plugins/supabase';

const { mode } = withDefaults(defineProps<{ mode: 'signup' | 'signin' }>(), { mode: 'signup' });

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');

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
    console.log('User signed in:', response.data.user);
  }
};
</script>
