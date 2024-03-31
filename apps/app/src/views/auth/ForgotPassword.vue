<template>
  <Auth>
    <template v-if="emailSent">
      <h1 class="mt-8 mb-2 text-neutral-100">Check your email</h1>
      <p class="text-body-small text-neutral-400 mb-4">
        We've sent an email to <span class="text-neutral-200">{{ emailModel }}</span
        >. Please click the link in the email to continue resetting your password.
      </p>
      <Button
        :label="`Resend confirmation email ${resendEmailCountdown > 0 ? `(${resendEmailCountdown})` : ''}`"
        :disabled="resendEmailCountdown > 0 || pending"
        size="large"
        :loading="pending"
        loadingIcon="progress_activity"
        @click="resendEmail"
      />
    </template>
    <template v-else>
      <h1 class="mt-8 mb-2 text-neutral-100">Reset your password</h1>
      <p class="text-body-small text-neutral-400 mb-6">Type in your email and we'll send you a link to reset your password</p>
      <form class="flex flex-col gap-y-5" @submit.prevent="resetPassword">
        <div v-if="error" class="rounded-xs bg-error-dark ring-1 ring-error text-neutral-300 px-4 py-3 text-body-small">
          {{ error }}
        </div>
        <Control label="Email" hideDetails class="my-4">
          <InputText v-model="emailModel" type="email" required placeholder="you@example.com" size="large" />
        </Control>
        <Button type="submit" size="large" :disabled="pending" :loading="pending" loadingIcon="progress_activity">Send reset email</Button>
      </form>
      <div class="text-caption text-neutral-400 mt-6">
        <p class="flex justify-center items-center">
          Already have an account?
          <RouterLink to="/signin" tabindex="-1">
            <Button link class="!text-caption !px-1" label="Sign in now"></Button>
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

const props = defineProps<{ email?: string }>();
const toaster = useToaster();
const error = ref('');
const emailModel = ref(props.email ?? '');
const emailSent = ref(false);
const pending = ref(false);

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

const redirectTo = `${window.location.origin}/platform/profile?passwordRecovery=true`;

const resetPassword = async () => {
  pending.value = true;
  error.value = '';
  const response = await supabase.auth.resetPasswordForEmail(emailModel.value, {
    redirectTo,
  });

  if (response.error) {
    error.value = response.error.message;
  } else {
    emailSent.value = true;
    startResendCountdown();
  }

  pending.value = false;
};

const resendEmail = async () => {
  pending.value = true;
  const response = await supabase.auth.resetPasswordForEmail(emailModel.value, {
    redirectTo,
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

  pending.value = false;
};
</script>
