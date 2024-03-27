<template>
  <div class="view">
    <h2>Agient</h2>
    <RouterLink to="/signup">
      <Button>Sign up</Button>
    </RouterLink>
    <RouterLink to="/signin">
      <Button>Sign in</Button>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
</script>
