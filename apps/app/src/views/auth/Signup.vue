<template>
  <Auth>
    <template v-if="emailSent">
      <h1 class="mt-8 mb-2 text-neutral-100">Confirm your email</h1>
      <p class="text-body-small text-neutral-400 mb-4">
        We've sent an email to <span class="text-neutral-200">{{ email }}</span
        >. Please click the link in the email to confirm your email address.
      </p>
      <Button
        :label="`Resend confirmation email ${resendEmailCountdown > 0 ? `(${resendEmailCountdown})` : ''}`"
        :disabled="resendEmailCountdown > 0"
        size="large"
        @click="resendEmail"
      />
    </template>
    <template v-else>
      <h1 class="mt-8 mb-2 text-neutral-100">Get started</h1>
      <p class="text-body-small text-neutral-400 mb-10">Create a new account</p>
      <form class="flex flex-col gap-y-5" @submit.prevent="signUp">
        <Control label="Firstname" size="large">
          <InputText v-model="firstName" required placeholder="John" size="large" />
        </Control>
        <Control label="Lastname" size="large" class="mb-1">
          <InputText v-model="lastName" required placeholder="Doe" size="large" />
        </Control>
        <Control label="Email" size="large">
          <InputText v-model="email" required placeholder="you@example.com" size="large" />
        </Control>
        <Control label="Password" size="large">
          <InputText v-model="password" required type="password" placeholder="••••••••" size="large" />
        </Control>
        <Button type="submit" size="large">Sign Up</Button>
      </form>
      <div class="text-caption text-neutral-400 mt-6">
        <p class="flex justify-center items-center">
          Already have an account?
          <RouterLink to="/signin">
            <Button link class="!text-caption" label="Sign in now"></Button>
          </RouterLink>
        </p>
      </div>
    </template>
  </Auth>
</template>

<script setup lang="ts">
import Control from '@/components/Control.vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { ref } from 'vue';
import { supabase } from '../../plugins/supabase';
import Auth from './Auth.vue';

const firstName = ref('');
const lastName = ref('');
const email = ref('eirik.maaseidvaag@gmail.com');
const password = ref('password123');
const emailSent = ref(false);

const resendEmailCountdown = ref(0);
const interval = ref<NodeJS.Timeout | null>(null);

const startResendCountdown = () => {
  resendEmailCountdown.value = 60;
  interval.value = setInterval(() => {
    if (resendEmailCountdown.value > 0) {
      resendEmailCountdown.value--;
    }

    if (resendEmailCountdown.value <= 0) {
      clearInterval(interval.value!);
      interval.value = null;
    }
  }, 1000);
};

// should be http://<current>/platform
const emailRedirectTo = `${window.location.origin}/platform`;

const signUp = async () => {
  const response = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      emailRedirectTo,
      data: {
        firstName: firstName.value,
        lastName: lastName.value,
      },
    },
  });

  if (response.error) {
    console.error('Error signing up:', response.error.message);
  } else {
    emailSent.value = true;
    startResendCountdown();
  }
};

const resendEmail = async () => {
  const response = await supabase.auth.resend({
    type: 'signup',
    email: email.value,
    options: {
      emailRedirectTo,
    },
  });

  if (response.error) {
    console.error('Error resending email:', response.error.message);
  } else {
    // TODO: Toaster success message
    startResendCountdown();
  }
};
</script>
