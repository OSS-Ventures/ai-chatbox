<script setup lang="ts">
import { AiChatInjectionKey } from './types';

// Props for customization
defineProps<{
  /**
   * Placeholder text for the input
   */
  placeholder?: string;
  /**
   * Optional class for the input element
   */
  inputClass?: string;
  /**
   * Optional class for the send button
   */
  buttonClass?: string;
}>();

defineSlots<{
  button: (props: { isLoading: boolean; disabled: boolean; handleSend: () => void; handleStop: () => void }) => any;
  input: (props: {
    value: string;
    onInput: (event: Event) => void;
    onKeydown: (event: KeyboardEvent) => void;
    placeholder?: string;
    onSend: () => void;
  }) => any;
}>();

// Inject context from AiChatRoot
const chatContext = inject(AiChatInjectionKey);
if (!chatContext) {
  throw new Error('AiChatInput must be used within AiChatRoot');
}

const { sendMessage, stop, isLoading } = chatContext;
const inputValue = ref('');

function handleSend() {
  if (inputValue.value.trim() && !isLoading.value) {
    sendMessage(inputValue.value);
    inputValue.value = '';
  }
}

function handleStop() {
  stop();
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  inputValue.value = target.value;
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    handleSend();
  }
}
</script>

<template>
  <div class="ai-chat-input">
    <slot
      name="input"
      :value="inputValue"
      :on-input="handleInput"
      :on-keydown="handleKeydown"
      :placeholder="placeholder || 'Type a message...'"
      :on-send="handleSend"
    >
      <textarea
        v-model="inputValue"
        class="ai-chat-input__textarea"
        :class="inputClass"
        :placeholder="placeholder || 'Type a message...'"
        rows="1"
        @keydown="handleKeydown"
      ></textarea>
    </slot>

    <slot name="button" :is-loading="isLoading" :disabled="!inputValue.trim()" :handle-send="handleSend" :handle-stop="handleStop">
      <button
        class="ai-chat-input__button"
        :class="buttonClass"
        :disabled="isLoading || !inputValue.trim()"
        @click="handleSend"
      >
        {{ isLoading ? 'Sending...' : 'Send' }}
      </button>
    </slot>
  </div>
</template>
