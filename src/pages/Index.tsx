import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChatMessage as ChatMessageComponent } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { ChatMessage, ChatState } from "@/types/chat";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarProvider,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  const { toast } = useToast();

  useEffect(() => {
    loadConversations();
    if (!currentConversationId) {
      createNewConversation();
    }
  }, []);

  useEffect(() => {
    if (currentConversationId) {
      loadMessages(currentConversationId);
    }
  }, [currentConversationId]);

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
          role: msg.role,
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
          title: 'New Conversation',
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

    // Save user message to database
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
        body: { messages: [...chatState.messages, newMessage].map(m => ({
          role: m.role,
          content: m.content,
        }))},
      });

      if (aiResponse.choices && aiResponse.choices[0]) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: aiResponse.choices[0].message.content,
          role: "assistant",
          timestamp: new Date(),
        };

        // Save assistant message to database
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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <Button 
                  onClick={createNewConversation}
                  className="w-full mb-4"
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Chat
                </Button>
                {conversations.map((conv) => (
                  <SidebarMenuItem key={conv.id}>
                    <SidebarMenuButton
                      onClick={() => setCurrentConversationId(conv.id)}
                      className={currentConversationId === conv.id ? "bg-accent" : ""}
                    >
                      {conv.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h1 className="text-2xl font-bold text-primary">Healthcare Assistant</h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
          
          <div className="flex-1 overflow-hidden flex flex-col p-4">
            <MedicalDisclaimer />
            
            <div className="flex-1 overflow-y-auto space-y-4 my-4">
              {chatState.messages.map((message) => (
                <ChatMessageComponent key={message.id} message={message} />
              ))}
              {chatState.isLoading && (
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-background pt-4">
              <ChatInput onSend={handleSendMessage} isLoading={chatState.isLoading} />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;