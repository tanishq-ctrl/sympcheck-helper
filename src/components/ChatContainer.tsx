import { ChatMessage as ChatMessageComponent } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { ChatMessage, ChatState } from "@/types/chat";
import { Loader2 } from "lucide-react";

interface ChatContainerProps {
  chatState: ChatState;
  onSendMessage: (content: string) => Promise<void>;
}

export const ChatContainer = ({ chatState, onSendMessage }: ChatContainerProps) => {
  return (
    <div className="flex-1 overflow-hidden flex flex-col p-4">
      <MedicalDisclaimer />
      
      <div className="flex-1 overflow-y-auto space-y-4 my-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {chatState.messages.map((message: ChatMessage) => (
          <ChatMessageComponent key={message.id} message={message} />
        ))}
        {chatState.isLoading && (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-gradient-to-t from-gray-900 to-transparent pt-4">
        <ChatInput onSend={onSendMessage} isLoading={chatState.isLoading} />
      </div>
    </div>
  );
};