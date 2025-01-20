import { ChatMessage as ChatMessageType } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full animate-message-fade-in opacity-0 gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
          <Bot className="h-5 w-5 text-white" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2 shadow-lg backdrop-blur-sm",
          isUser
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none"
            : "bg-gradient-to-r from-gray-800/90 to-gray-900/90 text-white rounded-bl-none"
        )}
      >
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
          <User className="h-5 w-5 text-white" />
        </div>
      )}
    </div>
  );
};