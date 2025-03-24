<script setup lang="ts">
// Define props with a default slot for customization
defineProps<{
  /**
   * Optional title for the chat
   */
  title?: string;
}>();

defineSlots<{
  default: (props: object) => any;
}>();
</script>

<template>
  <div class="ai-chat-header">
    <slot>
      <h2 v-if="title">
        {{ title }}
      </h2>
    </slot>
  </div>
</template>
