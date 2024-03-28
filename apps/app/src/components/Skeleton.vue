<template>
  <div aria-hidden="true" class="skeleton relative overflow-hidden bg-neutral-800"></div>
</template>

<style scoped lang="scss">
.skeleton::after {
  @apply content-[''] h-full left-0 right-0 top-0 absolute -translate-x-full z-[1];
  @apply bg-gradient-to-r from-transparent via-neutral-700/40 to-transparent;

  animation: skeleton-animation 1.2s infinite;
}

@keyframes skeleton-animation {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}
</style>
