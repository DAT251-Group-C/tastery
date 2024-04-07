<template>
  <div class="min-h-screen flex flex-col">
    <div class="flex flex-col flex-1 bg-neutral-100">
      <div class="flex flex-1">
        <main class="flex flex-col items-center flex-1 flex-shrink-0 px-5 pt-16 pb-8 border-r border-neutral-300 shadow-lg bg-neutral-200">
          <div class="flex-1 flex flex-col justify-center w-[330px] sm:w-[384px]">
            <slot></slot>
          </div>
        </main>
        <aside class="flex-col items-center justify-center flex-1 flex-shrink hidden basis-1/4 xl:flex">
          <h1 class="text-neutral-700 max-w-lg">
            This is where we'll write good stuff about Tastery once we've gotten a bit further ahead 😍
          </h1>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
