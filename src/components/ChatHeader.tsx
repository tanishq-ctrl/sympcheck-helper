import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface ChatHeaderProps {
  onLogout: () => void;
}

export const ChatHeader = ({ onLogout }: ChatHeaderProps) => {
  return (
    <div className="flex justify-between items-center p-4 border-b border-white/10 bg-gray-900/50 backdrop-blur-sm">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
        HealthAssist
      </h1>
      <Button
        variant="outline"
        onClick={onLogout}
        className="border-white/10 hover:bg-white/5"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign out
      </Button>
    </div>
  );
};