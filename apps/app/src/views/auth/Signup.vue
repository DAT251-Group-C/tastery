<template>
  <Auth>
    <template v-if="emailSent">
      <h1 class="mt-8 mb-2 text-neutral-800">Confirm your email</h1>
      <p class="text-body-small text-neutral-600 mb-4">
        We've sent an email to <span class="text-neutral-800">{{ emailModel }}</span
        >. Please click the link in the email to confirm your email address.
      </p>
      <Button
        :label="`Resend confirmation email ${resendEmailCountdown > 0 ? `(${resendEmailCountdown})` : ''}`"
        :disabled="isPending || resendEmailCountdown > 0"
        :loading="isPending"
        loadingIcon="progress_activity"
        size="large"
        @click="resendEmail"
      />
    </template>
    <template v-else>
      <h1 class="mt-8 mb-2 text-neutral-800">Get started</h1>
      <p class="text-body-small text-neutral-600 mb-10">Create a new account</p>
      <form class="flex flex-col gap-y-5" @submit.prevent="signUp">
        <div v-if="error" class="rounded-xs bg-error-dark ring-1 ring-error text-neutral-800 px-4 py-3 text-body-small">
          {{ error }}
        </div>
        <Control label="Firstname" hideDetails required>
          <InputText v-model="firstName" required placeholder="John" size="large" />
        </Control>
        <Control label="Lastname" class="mb-1" hideDetails required>
          <InputText v-model="lastName" required placeholder="Doe" size="large" />
        </Control>
        <Control label="Email" hideDetails>
          <InputText v-model="emailModel" type="email" required placeholder="you@example.com" size="large" />
        </Control>
        <Control label="Password" hideDetails>
          <InputText v-model="password" required type="password" minLength="8" placeholder="••••••••" size="large" />
        </Control>
        <Button type="submit" size="large" :disabled="isPending" :loading="isPending" loadingIcon="progress_activity">Sign Up</Button>
      </form>
      <div class="text-caption text-neutral-600 mt-6">
        <p class="flex justify-center items-center">
          Already have an account?
          <RouterLink :to="{ name: 'Sign in', query: { hash } }" tabindex="-1">
            <Button link class="!text-caption !px-1 !text-neutral-800 hover!text-neutral-600" label="Sign in now"></Button>
          </RouterLink>
        </p>
      </div>
    </template>
  </Auth>
</template>

<script setup lang="ts">
import Control from '@/components/atoms/Control.vue';
import { useToaster } from '@/composables/toaster';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { ref } from 'vue';
import { supabase } from '../../plugins/supabase';
import Auth from './Auth.vue';

const props = defineProps<{ email?: string; hash?: string }>();
const toaster = useToaster();
const error = ref('');
const firstName = ref('');
const lastName = ref('');
const emailModel = ref(props.email ?? '');
const password = ref('');
const emailSent = ref(false);
const isPending = ref(false);

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

const emailRedirectTo = props.hash ? `${window.location.origin}/invite/?hash=${props.hash}` : `${window.location.origin}/platform`;

const signUp = async () => {
  error.value = '';
  isPending.value = true;
  const response = await supabase.auth.signUp({
    email: emailModel.value,
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
    error.value = response.error.message;
  } else {
    emailSent.value = true;
    startResendCountdown();
  }
  isPending.value = false;
};

const resendEmail = async () => {
  isPending.value = true;
  const response = await supabase.auth.resend({
    type: 'signup',
    email: emailModel.value,
    options: {
      emailRedirectTo,
    },
  });

  if (response.error) {
    toaster.add({
      summary: 'Error resending email',
      detail: response.error.message,
      severity: 'error',
    });
  } else {
    toaster.add({
      summary: 'Email resent',
      detail: 'An email has been resent to your email address. Please check your inbox!',
      severity: 'info',
    });
    startResendCountdown();
  }
  isPending.value = false;
};
</script>
