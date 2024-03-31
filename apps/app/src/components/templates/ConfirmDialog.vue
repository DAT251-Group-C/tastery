<template>
  <ConfirmDialog>
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="rounded-xs ring-1 ring-neutral-900 bg-neutral-800">
        <div class="flex items-center justify-between rounded-t-xs bg-neutral-700/25 text-neutral-200 px-5 py-3">
          <p class="text-body-small-bold">{{ message.header }}</p>
          <Button severity="neutral" text rounded icon="close" @click="rejectCallback()"></Button>
        </div>
        <div class="border-y border-neutral-700 px-5 pt-6 pb-8 text-body-small">
          <p class="text-neutral-200">{{ message.message }}</p>
        </div>
        <div class="flex items-center justify-end shrink-0 text-right gap-3 px-6 py-3 rounded-b-xs">
          <Button
            :severity="message.rejectSeverity ?? 'neutral'"
            :label="message.rejectLabel ?? 'Cancel'"
            @click="rejectCallback()"
          ></Button>
          <Button :severity="message.rejectSeverity" :label="message.acceptLabel ?? 'Confirm'" @click="acceptCallback()"></Button>
        </div>
      </div>
    </template>
  </ConfirmDialog>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
</script>
