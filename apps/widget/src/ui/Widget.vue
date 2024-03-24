<template>
  <div class="flex flex-col ring ring-primary bg-neutral-background w-64 h-96 rounded-sm">
    <div class="p-6 pb-0 overflow-y-auto flex flex-col gap-2">
      <p class="-mt-2">Agient</p>
      <p v-for="msg of messages" :key="msg.id" :class="[msg.isUser ? 'right' : 'left', 'px-2 py-1 rounded-xs']">{{ msg.text }}</p>
      <p v-if="context" class="context">{{ context }}...</p>
    </div>

    <div class="relative mt-auto flex p-6">
      <p v-if="writing" class="absolute -top-1">Agient is writing...</p>
      <input v-model="chat" placeholder="Write a response" />
      <button :disabled="disabled" @click="submit()">Send</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatCompletionMessageToolCall } from 'openai/resources';
import { v4 } from 'uuid';
import { onMounted, ref } from 'vue';
import type { AgientProvider } from '../core/types';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

const context = ref<string | null>(null);
const chat = ref<string>('can you increment my counter by 2, then multiply it by 4?');
const writing = ref<boolean>(false);
const disabled = ref<boolean>(true);
const messages = ref<Message[]>([]);
const { provider } = defineProps<{
  provider: AgientProvider;
}>();

onMounted(() => {
  setTimeout(() => {
    if (messages.value.length === 0) {
      writing.value = true;
    }
  }, 200);
});

provider.on('response', (value: string) => {
  messages.value.push({
    id: v4(),
    text: value,
    isUser: false,
  });
  writing.value = false;
  context.value = null;
  disabled.value = false;
});

provider.on('before_tool_call', (call: ChatCompletionMessageToolCall) => {
  const data = JSON.parse(call.function.arguments);
  if (data.__context_message && typeof data.__context_message === 'string') {
    context.value = data.__context_message;
  }
});

const submit = () => {
  messages.value.push({
    id: v4(),
    text: chat.value,
    isUser: true,
  });
  disabled.value = true;
  provider.chat(chat.value);
  chat.value = '';

  const messagesLength = messages.value.length;
  setTimeout(() => {
    if (messages.value.length === messagesLength) {
      writing.value = true;
    }
  }, 200);
};
</script>
