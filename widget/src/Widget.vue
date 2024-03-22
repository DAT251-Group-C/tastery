<template>
  <div class="widget">
    <div class="inner">
      <p>Agient</p>
      <p v-for="msg of messages" :key="msg">{{ msg }}</p>
    </div>

    <div class="input">
      <p v-if="writing" class="writing">Agient is writing...</p>
      <input v-model="chat" placeholder="Write a response" />
      <button @click="submit()">Send</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import { AGIENT_INSTANCE_TOKEN } from '../public-api';
import { AgientProvider, TODO } from './socket/types';

const chat = ref<string>('can you increment my counter by 2, then multiply it by 4?');
const writing = ref<boolean>(false);
const messages = ref<string[]>([]);
const instance = inject<AgientProvider>(AGIENT_INSTANCE_TOKEN)!;

onMounted(() => {
  setTimeout(() => {
    if (messages.value.length === 0) {
      writing.value = true;
    }
  }, 200);
});

instance.on('response', (value: TODO) => {
  messages.value.push(value.toString());
  writing.value = false;
});

const submit = () => {
  messages.value.push(chat.value);
  instance.chat(chat.value);
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
  padding: 1.5rem 1.5rem 0 1.5rem;
  overflow-y: auto;
  font-size: 14px;
}

.input {
  position: relative;
  margin-top: auto;
  display: flex;
  padding: 26px 1.5rem 1.5rem 1.5rem;

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
</style>
