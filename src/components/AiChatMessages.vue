<script setup lang="ts">
import { useScroll } from '@vueuse/core';
import { AiChatInjectionKey } from './types';

// Define props for customization
defineProps<{
  /**
   * Optional class for the messages container
   */
  containerClass?: string;
  /**
   * Optional class for user messages
   */
  userMessageClass?: string;
  /**
   * Optional class for assistant messages
   */
  assistantMessageClass?: string;
  /**
   * Optional class for tool messages
   */
  toolMessageClass?: string;
}>();

defineSlots<{
  message: (props: { message: any }) => any;
  loading: () => any;
}>();

// Inject context from AiChatRoot
const chatContext = inject(AiChatInjectionKey);
if (!chatContext) {
  throw new Error('AiChatMessages must be used within AiChatRoot');
}

const { messages, isLoading } = chatContext;

// Auto-scroll functionality
const messagesContainerRef = ref<HTMLElement | null>(null);
const autoScroll = ref(true);
const { isScrolling, y, directions, arrivedState } = useScroll(messagesContainerRef);
const { bottom: isBottom } = toRefs(arrivedState);
const { top: scrollingUp } = toRefs(directions);

// Watch for changes in messages to auto-scroll to bottom
watch(messages, async () => {
  await nextTick();
  if (messagesContainerRef.value && autoScroll.value) {
    y.value = messagesContainerRef.value.scrollHeight;
  }
}, { deep: true });

// Re-enable auto-scroll when user scrolls to bottom
watch(isBottom, () => {
  if (isBottom.value) {
    autoScroll.value = true;
  }
});

// Disable auto-scroll when user scrolls up
watch(isScrolling, () => {
  if (autoScroll.value && scrollingUp.value) {
    autoScroll.value = false;
  }
});
</script>

<template>
  <div
    ref="messagesContainerRef"
    class="ai-chat-messages"
    :class="containerClass"
  >
    <template v-for="(message, index) in messages" :key="index">
      <slot
        name="message"
        :message="message"
      >
        <div
          class="ai-chat-message"
          :class="[
            {
              user: userMessageClass,
              assistant: assistantMessageClass,
              tool_call: toolMessageClass,
            }[message.role],
            `ai-chat-message--${message.role}`,
          ]"
        >
          {{ message.content }}
        </div>
      </slot>
    </template>

    <slot v-if="isLoading" name="loading" class="ai-chat-loading" />
  </div>
</template>
