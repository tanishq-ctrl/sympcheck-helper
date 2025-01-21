import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChatMessage as ChatMessageComponent } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { ChatMessage, ChatState, MessageRole } from "@/types/chat";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SidebarConversation } from "@/components/SidebarConversation";
import { PatientDetailsDialog } from "@/components/PatientDetailsDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarProvider,
  SidebarGroup,
  SidebarGroupContent,
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
      <Dialog open={showWelcomeDialog} onOpenChange={setShowWelcomeDialog}>
        <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to HealthAssist! 👨‍⚕️
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 dark:text-gray-300">
              Let us help you feel better! 😊
            </DialogDescription>
          </DialogHeader>
          <PatientDetailsDialog onSubmitted={handlePatientDetailsSubmitted} />
        </DialogContent>
      </Dialog>

      <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800">
        <Sidebar className="border-r border-white/10">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <Button 
                  onClick={createNewConversation}
                  className="w-full mb-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Consultation
                </Button>
                {conversations.map((conv) => (
                  <SidebarConversation
                    key={conv.id}
                    id={conv.id}
                    title={conv.title}
                    isActive={currentConversationId === conv.id}
                    onClick={() => setCurrentConversationId(conv.id)}
                    onDelete={() => handleDeleteConversation(conv.id)}
                  />
                ))}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-white/10 bg-gray-900/50 backdrop-blur-sm">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              HealthAssist
            </h1>
            <Button variant="outline" onClick={handleLogout} className="border-white/10 hover:bg-white/5">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
          
          <div className="flex-1 overflow-hidden flex flex-col p-4">
            <MedicalDisclaimer />
            
            <div className="flex-1 overflow-y-auto space-y-4 my-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {chatState.messages.map((message) => (
                <ChatMessageComponent key={message.id} message={message} />
              ))}
              {chatState.isLoading && (
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gradient-to-t from-gray-900 to-transparent pt-4">
              <ChatInput onSend={handleSendMessage} isLoading={chatState.isLoading} />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
