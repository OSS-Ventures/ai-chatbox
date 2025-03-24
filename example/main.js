import { createApp } from 'vue';
import { AIChatbox } from '../dist/ai-chatbox.js';
import '../dist/style.css';

const app = createApp({
  data() {
    return {
      initialMessages: [
        {
          role: 'assistant',
          content: 'Hello! How can I help you today?',
          timestamp: new Date()
        }
      ]
    };
  },
  methods: {
    handleSend(message) {
      console.log('Message sent:', message);
      
      // Simulate AI response after a short delay
      setTimeout(() => {
        this.$refs.chatbox.receiveMessage(this.generateResponse(message.content));
      }, 1000);
    },
    handleReceive(message) {
      console.log('Message received:', message);
    },
    generateResponse(userMessage) {
      // This is just a simple demo response generator
      const responses = [
        "That's interesting! Tell me more about that.",
        "I understand. How can I help you with this?",
        "Thanks for sharing. Is there anything specific you'd like to know?",
        `I see you said: "${userMessage}". Could you elaborate on that?`,
        "That's a great question! Let me think about that...",
        "I'm here to help. What else would you like to discuss?",
        "Let me see if I understand correctly. You're asking about " + userMessage.split(' ').slice(0, 3).join(' ') + "...",
      ];
      
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
});

app.component('AIChatbox', AIChatbox);
app.mount('#app');
