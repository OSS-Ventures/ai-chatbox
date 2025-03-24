import { App } from 'vue';
import AIChatbox from './components/AIChatbox.vue';

// Export the component
export { AIChatbox };

// Export types
export type { ChatMessage } from './components/AIChatbox.vue';

// Create Vue plugin
const plugin = {
  install: (app: App): void => {
    app.component('AIChatbox', AIChatbox);
  }
};

export { plugin as default };
