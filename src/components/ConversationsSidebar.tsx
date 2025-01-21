import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SidebarConversation } from "@/components/SidebarConversation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

interface ConversationsSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

export const ConversationsSidebar = ({
  conversations,
  currentConversationId,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
}: ConversationsSidebarProps) => {
  return (
    <Sidebar className="border-r border-white/10">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <Button
              onClick={onNewConversation}
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
                onClick={() => onSelectConversation(conv.id)}
                onDelete={() => onDeleteConversation(conv.id)}
              />
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};