# AI Chatbox

A customizable Vue.js AI chat component used by various OSS Ventures startups.

## Installation

```bash
npm install ai-chatbox
# or
yarn add ai-chatbox
```

## Usage

### Global Registration

```js
import { createApp } from 'vue';
import AIChatbox from 'ai-chatbox';
import 'ai-chatbox/dist/style.css';

const app = createApp(App);
app.use(AIChatbox);
app.mount('#app');
```

### Local Registration

```js
import { AIChatbox } from 'ai-chatbox';
import 'ai-chatbox/dist/style.css';

export default {
  components: {
    AIChatbox
  }
}
```

### Basic Example

```vue
<template>
  <div class="chat-container">
    <ai-chatbox
      :initial-messages="messages"
      @send="handleSend"
    />
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const messages = ref([
      {
        role: 'assistant',
        content: 'Hello! How can I help you today?',
        timestamp: new Date()
      }
    ]);

    const handleSend = (message) => {
      // Handle the sent message
      console.log('User sent:', message);
      
      // Here you would typically make an API call to your AI service
      // and then add the response to the chat
    };

    return {
      messages,
      handleSend
    };
  }
}
</script>

<style>
.chat-container {
  height: 500px;
  width: 100%;
}
</style>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialMessages` | `Array` | `[]` | Initial messages to display in the chat |
| `placeholder` | `String` | `'Type your message...'` | Placeholder text for the input field |
| `autoScroll` | `Boolean` | `true` | Automatically scroll to the bottom when new messages arrive |
| `markdownSupport` | `Boolean` | `true` | Enable markdown rendering for messages |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `send` | `ChatMessage` | Emitted when the user sends a message |
| `receive` | `ChatMessage` | Emitted when a message is received |

## Types

```ts
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
```

## Customization

The component provides several slots for customization:

- `user-avatar`: Custom user avatar
- `assistant-avatar`: Custom assistant avatar
- `send-button`: Custom send button

Example:

```vue
<ai-chatbox>
  <template #user-avatar>
    <img src="./assets/user-avatar.png" alt="User" />
  </template>
  
  <template #assistant-avatar>
    <img src="./assets/bot-avatar.png" alt="Assistant" />
  </template>
  
  <template #send-button>
    <span>Send</span>
  </template>
</ai-chatbox>
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint
```

## License

MIT
