import { useState } from "react";
import { ChatMessage as ChatMessageComponent } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { ChatMessage, ChatState } from "@/types/chat";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [
      {
        id: "1",
        content: "Hi, I'm your virtual health assistant. How can I help you today?",
        role: "assistant",
        timestamp: new Date(),
      },
    ],
    isLoading: false,
    error: null,
  });

  const { toast } = useToast();

  const handleSendMessage = async (content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      isLoading: true,
    }));

    // Simulate AI response (replace with actual DeepSeek API call)
    setTimeout(() => {
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I understand you're concerned. While I can provide general information, remember to consult a healthcare provider for personalized medical advice. Could you tell me more about your symptoms?",
        role: "assistant",
        timestamp: new Date(),
      };

      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, response],
        isLoading: false,
      }));
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background p-4">
      <div className="mx-auto w-full max-w-2xl flex-1">
        <h1 className="mb-4 text-2xl font-bold text-primary">Healthcare Assistant</h1>
        <MedicalDisclaimer />
        
        <div className="my-4 flex flex-1 flex-col space-y-4 overflow-y-auto">
          {chatState.messages.map((message) => (
            <ChatMessageComponent key={message.id} message={message} />
          ))}
        </div>

        <div className="sticky bottom-0 bg-background pt-4">
          <ChatInput onSend={handleSendMessage} isLoading={chatState.isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Index;