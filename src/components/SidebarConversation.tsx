import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarConversationProps {
  id: string;
  title: string;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export const SidebarConversation = ({
  id,
  title,
  isActive,
  onClick,
  onDelete,
}: SidebarConversationProps) => {
  return (
    <div className="group relative flex items-center gap-2">
      <Button
        variant="ghost"
        onClick={onClick}
        className={cn(
          "w-full justify-start text-left font-normal",
          isActive && "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white"
        )}
      >
        {title}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );
};