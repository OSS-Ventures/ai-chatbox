<script setup lang="ts">
import { type AiChatContext, AiChatInjectionKey, type Message } from './types';

const props = defineProps<{
  /**
   * Messages to display
   */
  messages: Message[];
  /**
   * Loading state
   */
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  'send': [content: string];
  'stop': [];
  'update:messages': [messages: Message[]];
  'update:isLoading': [isLoading: boolean];
}>();

defineSlots<{
  default: (props: object) => any;
}>();

// Provide context to child components
provide(AiChatInjectionKey, {
  messages: computed(() => props.messages),
  isLoading: computed(() => props.isLoading || false),
  sendMessage: (content: string) => {
    if (!content.trim())
      return;

    // Emit the send event with the content
    emit('send', content);
  },
  stop: () => {
    emit('stop');
  },
} as AiChatContext);
</script>

<template>
  <div class="ai-chat-root">
    <slot />
  </div>
</template>
