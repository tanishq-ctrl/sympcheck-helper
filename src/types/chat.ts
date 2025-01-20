export type MessageRole = "assistant" | "user" | "system";

export interface ChatAttachment {
  id: string;
  file_name: string;
  file_path: string;
  content_type: string;
  size: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: Date;
  attachments?: ChatAttachment[];
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}