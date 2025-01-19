export type MessageRole = "assistant" | "user" | "system";

export interface ChatMessage {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: Date;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}