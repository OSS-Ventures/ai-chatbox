<template>
  <div class="ai-chatbox">
    <div class="ai-chatbox-messages" ref="messagesContainer">
      <div 
        v-for="(message, index) in messages" 
        :key="index" 
        :class="['ai-chatbox-message', `ai-chatbox-message--${message.role}`]"
      >
        <div class="ai-chatbox-message-avatar">
          <slot :name="`${message.role}-avatar`">
            <div class="ai-chatbox-default-avatar">
              {{ message.role === 'user' ? '👤' : '🤖' }}
            </div>
          </slot>
        </div>
        <div class="ai-chatbox-message-content">
          <div class="ai-chatbox-message-text" v-html="formatMessage(message.content)"></div>
          <div class="ai-chatbox-message-time">{{ formatTime(message.timestamp) }}</div>
        </div>
      </div>
      <div v-if="isLoading" class="ai-chatbox-message ai-chatbox-message--assistant">
        <div class="ai-chatbox-message-avatar">
          <slot name="assistant-avatar">
            <div class="ai-chatbox-default-avatar">🤖</div>
          </slot>
        </div>
        <div class="ai-chatbox-message-content">
          <div class="ai-chatbox-typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
    <div class="ai-chatbox-input">
      <textarea
        v-model="userInput"
        :placeholder="placeholder"
        @keydown.enter.prevent="onEnterPress"
        :disabled="isLoading"
        ref="inputField"
        rows="1"
      ></textarea>
      <button 
        class="ai-chatbox-send-button" 
        @click="sendMessage" 
        :disabled="!userInput.trim() || isLoading"
      >
        <slot name="send-button">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </slot>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, nextTick, PropType } from 'vue';
import * as marked from 'marked';
import * as DOMPurify from 'dompurify';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default defineComponent({
  name: 'AIChatbox',
  props: {
    initialMessages: {
      type: Array as PropType<ChatMessage[]>,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: 'Type your message...',
    },
    autoScroll: {
      type: Boolean,
      default: true,
    },
    markdownSupport: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['send', 'receive'],
  setup(props: {
    initialMessages: ChatMessage[];
    placeholder: string;
    autoScroll: boolean;
    markdownSupport: boolean;
  }, { emit }: { emit: (event: 'send' | 'receive', message: ChatMessage) => void }) {
    const userInput = ref('');
    const messages = ref<ChatMessage[]>([...props.initialMessages]);
    const isLoading = ref(false);
    const messagesContainer = ref<HTMLElement | null>(null);
    const inputField = ref<HTMLTextAreaElement | null>(null);

    const sendMessage = async () => {
      const trimmedInput = userInput.value.trim();
      if (!trimmedInput || isLoading.value) return;

      // Add user message
      const userMessage: ChatMessage = {
        role: 'user',
        content: trimmedInput,
        timestamp: new Date(),
      };
      messages.value.push(userMessage);
      userInput.value = '';
      
      // Auto-resize input field
      if (inputField.value) {
        inputField.value.style.height = 'auto';
      }

      // Emit the send event
      emit('send', userMessage);
      
      // Set loading state
      isLoading.value = true;
      
      // Scroll to bottom
      if (props.autoScroll) {
        await nextTick();
        scrollToBottom();
      }
    };

    const receiveMessage = (content: string) => {
      // Add assistant message
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content,
        timestamp: new Date(),
      };
      messages.value.push(assistantMessage);
      
      // Reset loading state
      isLoading.value = false;
      
      // Emit the receive event
      emit('receive', assistantMessage);
      
      // Scroll to bottom
      if (props.autoScroll) {
        nextTick(() => {
          scrollToBottom();
        });
      }
    };

    const scrollToBottom = () => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
      }
    };

    const formatMessage = (content: string) => {
      if (props.markdownSupport) {
        // Convert markdown to HTML and sanitize
        return DOMPurify.sanitize(marked.parse(content));
      }
      return content;
    };

    const formatTime = (date: Date) => {
      return new Intl.DateTimeFormat('default', {
        hour: 'numeric',
        minute: 'numeric',
      }).format(date);
    };

    const onEnterPress = (e: KeyboardEvent) => {
      // Send message on Enter, allow Shift+Enter for new line
      if (!e.shiftKey) {
        sendMessage();
      }
    };

    // Auto-resize textarea as user types
    watch(userInput, () => {
      if (inputField.value) {
        inputField.value.style.height = 'auto';
        inputField.value.style.height = `${inputField.value.scrollHeight}px`;
      }
    });

    // Expose methods for parent components
    onMounted(() => {
      if (props.autoScroll && messages.value.length > 0) {
        scrollToBottom();
      }
    });

    return {
      userInput,
      messages,
      isLoading,
      messagesContainer,
      inputField,
      sendMessage,
      receiveMessage,
      formatMessage,
      formatTime,
      onEnterPress,
    };
  },
});
</script>

<style>
.ai-chatbox {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  overflow: hidden;
  background-color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.ai-chatbox-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ai-chatbox-message {
  display: flex;
  gap: 12px;
  max-width: 85%;
}

.ai-chatbox-message--user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.ai-chatbox-message--assistant {
  align-self: flex-start;
}

.ai-chatbox-message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ai-chatbox-default-avatar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;
  border-radius: 50%;
  font-size: 18px;
}

.ai-chatbox-message-content {
  background-color: #f0f2f5;
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
}

.ai-chatbox-message--user .ai-chatbox-message-content {
  background-color: #0084ff;
  color: white;
}

.ai-chatbox-message-text {
  word-break: break-word;
  line-height: 1.4;
}

.ai-chatbox-message-text pre {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 8px;
  border-radius: 4px;
  overflow-x: auto;
}

.ai-chatbox-message--user .ai-chatbox-message-text pre {
  background-color: rgba(255, 255, 255, 0.1);
}

.ai-chatbox-message-time {
  font-size: 11px;
  opacity: 0.7;
  margin-top: 4px;
  text-align: right;
}

.ai-chatbox-input {
  display: flex;
  align-items: flex-end;
  padding: 12px 16px;
  border-top: 1px solid #e1e4e8;
  background-color: #f8f9fa;
}

.ai-chatbox-input textarea {
  flex: 1;
  border: 1px solid #e1e4e8;
  border-radius: 20px;
  padding: 10px 16px;
  resize: none;
  max-height: 120px;
  outline: none;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.4;
}

.ai-chatbox-input textarea:focus {
  border-color: #0084ff;
}

.ai-chatbox-send-button {
  background-color: #0084ff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.ai-chatbox-send-button:hover {
  background-color: #0077e6;
}

.ai-chatbox-send-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.ai-chatbox-typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 0;
}

.ai-chatbox-typing-indicator span {
  width: 8px;
  height: 8px;
  background-color: #aaa;
  border-radius: 50%;
  display: inline-block;
  animation: typing 1.4s infinite both;
}

.ai-chatbox-typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.ai-chatbox-typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
  100% {
    opacity: 0.4;
    transform: scale(1);
  }
}
</style>
