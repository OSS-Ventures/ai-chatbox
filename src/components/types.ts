export interface Message {
  content: string;
  role: 'user' | 'assistant' | 'tool_call';
  details?: any;
}

export interface AiChatContext {
  messages: ComputedRef<Message[]>;
  isLoading: ComputedRef<boolean>;
  sendMessage: (content: string) => void;
  stop: () => void;
}

export const AiChatInjectionKey: InjectionKey<AiChatContext> = Symbol('AiChatContext');
