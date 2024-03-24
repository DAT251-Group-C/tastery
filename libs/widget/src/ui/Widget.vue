<template>
  <div class="widget bg-neutral-dark">
    <div class="inner w-full">
      <p style="margin-top: -0.5rem; margin-bottom: 0">Agient</p>
      <p v-for="msg of messages" :key="msg.id" :class="[msg.isUser ? 'right' : 'left', 'message']">{{ msg.text }}</p>
      <p v-if="context" class="context">{{ context }}...</p>
    </div>

    <div class="input">
      <p v-if="writing" class="writing">Agient is writing...</p>
      <input v-model="chat" placeholder="Write a response" />
      <button :disabled="disabled" @click="submit()">Send</button>
    </div>
    <img id="test" />
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

<style scoped lang="scss">
.widget {
  border-radius: 4px;
  border: 1px solid grey;
  width: 300px;
  height: 450px;
  display: flex;
  flex-direction: column;
}

.inner {
  padding: 1.5rem 1.5rem 0;
  overflow-y: auto;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .message {
    margin: 0;
    padding: 0.25rem 0.5rem;
    max-width: calc(100% - 3rem);
    border-radius: 4px;

    &.left {
      background-color: lightgrey;
    }

    &.right {
      background-color: lightblue;
      align-self: flex-end;
    }
  }

  .left + .right {
    margin-top: 0.5rem;
  }

  .right + .left {
    margin-top: 0.5rem;
  }
}

.input {
  position: relative;
  margin-top: auto;
  display: flex;
  padding: 26px 1.5rem 1.5rem;

  input {
    width: 100%;
    padding: 0.5rem;
  }

  .writing {
    position: absolute;
    font-size: 12px;
    top: 4px;
    margin: 0;
    left: 1.5rem;
  }
}

.context {
  background-color: lightgreen;
  font-size: 12px;
  padding: 0.25rem;
  align-self: start;
}
</style>
./socket/test./core/types.../types../core
