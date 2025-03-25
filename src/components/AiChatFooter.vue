<script setup lang="ts">
defineSlots<{
  default: (props: object) => any;
}>();
</script>

<template>
  <div class="ai-chat-footer">
    <slot />
  </div>
</template>
