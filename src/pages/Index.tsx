import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { WelcomeDialog } from "@/components/WelcomeDialog";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatContainer } from "@/components/ChatContainer";
import { ConversationsSidebar } from "@/components/ConversationsSidebar";
import { ChatState, ChatMessage, MessageRole } from "@/types/chat";

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(true);
  const [hasPatientDetails, setHasPatientDetails] = useState(false);
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  const { toast } = useToast();

  useEffect(() => {
    checkPatientDetails();
    loadConversations();
    if (!currentConversationId) {
      createNewConversation();
    }
  }, []);

  const checkPatientDetails = async () => {
    const { data, error } = await supabase
      .from('patient_details')
      .select('*')
      .single();

    if (data) {
      setHasPatientDetails(true);
      setShowWelcomeDialog(false);
    }
  };

  const handlePatientDetailsSubmitted = () => {
    setShowWelcomeDialog(false);
    setHasPatientDetails(true);
    toast({
      title: "Welcome to HealthAssist!",
      description: "How can I help you today?",
    });
  };

  const loadConversations = async () => {
    const { data, error } = await supabase
      .from('chat_conversations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load conversations",
      });
    } else {
      setConversations(data);
    }
  };

  const loadMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load messages",
      });
    } else {
      setChatState(prev => ({
        ...prev,
        messages: data.map(msg => ({
          id: msg.id,
          content: msg.content,
          role: msg.role as MessageRole,
          timestamp: new Date(msg.created_at),
        })),
      }));
    }
  };

  const createNewConversation = async () => {
    const { data, error } = await supabase
      .from('chat_conversations')
      .insert([
        { 
          title: 'New Consultation',
          user_id: (await supabase.auth.getUser()).data.user?.id,
        }
      ])
      .select()
      .single();

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create new conversation",
      });
    } else {
      setCurrentConversationId(data.id);
      setConversations(prev => [data, ...prev]);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    } else {
      navigate("/auth");
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!currentConversationId) return;

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

    const { error: saveError } = await supabase
      .from('chat_messages')
      .insert([
        {
          conversation_id: currentConversationId,
          content: content,
          role: 'user',
        }
      ]);

    if (saveError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save message",
      });
      return;
    }

    try {
      const { data: aiResponse } = await supabase.functions.invoke('chat', {
        body: { 
          messages: [...chatState.messages, newMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          context: "You are HealthAssist, a medical AI assistant. Your purpose is to provide helpful medical information and guidance, while always maintaining appropriate medical disclaimers and encouraging users to seek professional medical help when necessary."
        },
      });

      if (aiResponse.choices && aiResponse.choices[0]) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: aiResponse.choices[0].message.content,
          role: "assistant",
          timestamp: new Date(),
        };

        await supabase
          .from('chat_messages')
          .insert([
            {
              conversation_id: currentConversationId,
              content: assistantMessage.content,
              role: 'assistant',
            }
          ]);

        setChatState((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
          isLoading: false,
        }));
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get AI response",
      });
      setChatState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to get AI response",
      }));
    }
  };

  const handleDeleteConversation = async (id: string) => {
    const { error } = await supabase
      .from('chat_conversations')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete conversation",
      });
    } else {
      setConversations(prev => prev.filter(conv => conv.id !== id));
      if (currentConversationId === id) {
        createNewConversation();
      }
    }
  };

  return (
    <SidebarProvider>
      <WelcomeDialog
        open={showWelcomeDialog}
        onOpenChange={setShowWelcomeDialog}
        onPatientDetailsSubmitted={handlePatientDetailsSubmitted}
      />

      <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800">
        <ConversationsSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onNewConversation={createNewConversation}
          onSelectConversation={setCurrentConversationId}
          onDeleteConversation={handleDeleteConversation}
        />

        <div className="flex-1 flex flex-col">
          <ChatHeader onLogout={handleLogout} />
          <ChatContainer
            chatState={chatState}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;