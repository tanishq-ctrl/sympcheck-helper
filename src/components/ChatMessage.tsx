import { ChatMessage as ChatMessageType } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Bot, User, File, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  const renderAttachment = (attachment: any) => {
    const isImage = attachment.content_type.startsWith('image/');
    const url = supabase.storage
      .from('chat_attachments')
      .getPublicUrl(attachment.file_path).data.publicUrl;

    if (isImage) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="block mb-2">
          <img 
            src={url} 
            alt={attachment.file_name}
            className="max-w-[200px] rounded-lg shadow-lg hover:opacity-90 transition-opacity"
          />
        </a>
      );
    }

    return (
      <a 
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors mb-2"
      >
        <File className="h-4 w-4" />
        <span className="text-sm truncate">{attachment.file_name}</span>
      </a>
    );
  };

  return (
    <div
      className={cn(
        "flex w-full animate-message-fade-in opacity-0 gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
          <Bot className="h-5 w-5 text-white" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2 shadow-lg backdrop-blur-sm",
          isUser
            ? "bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white rounded-br-none"
            : "bg-gradient-to-r from-gray-800/90 to-gray-900/90 text-white rounded-bl-none"
        )}
      >
        {message.attachments?.map((attachment) => renderAttachment(attachment))}
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