<template>
  <div class="view">
    <h2>Tastery</h2>
    <RouterLink to="/signup" tabindex="-1">
      <Button>Sign up</Button>
    </RouterLink>
    <RouterLink to="/signin" tabindex="-1">
      <Button>Sign in</Button>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
</script>
