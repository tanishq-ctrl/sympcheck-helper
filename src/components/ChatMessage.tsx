import { ChatMessage as ChatMessageType } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Bot, User, File, Copy, Pencil, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  const isUser = message.role === "user";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        description: "Message copied to clipboard",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to copy message",
      });
    }
  };

  const handleSaveEdit = async () => {
    if (editedContent.trim() === "") return;
    
    const { error } = await supabase
      .from('chat_messages')
      .update({ content: editedContent })
      .eq('id', message.id);

    if (error) {
      toast({
        variant: "destructive",
        description: "Failed to update message",
      });
      return;
    }

    toast({
      description: "Message updated successfully",
    });
    setIsEditing(false);
  };

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

  const formatMessage = (content: string) => {
    // Replace **text** with bold text
    let formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
    
    // Replace #text with capitalized text
    formattedContent = formattedContent.replace(/###\s*(.*?)(?:\n|$)/g, '<h3 class="text-lg font-semibold uppercase mb-2">$1</h3>');
    formattedContent = formattedContent.replace(/##\s*(.*?)(?:\n|$)/g, '<h2 class="text-xl font-semibold uppercase mb-2">$1</h2>');
    formattedContent = formattedContent.replace(/#\s*(.*?)(?:\n|$)/g, '<h1 class="text-2xl font-semibold uppercase mb-3">$1</h1>');
    
    // Convert newlines to <br> tags
    formattedContent = formattedContent.replace(/\n/g, '<br>');
    
    return formattedContent;
  };

  return (
    <div
      className={cn(
        "flex w-full animate-message-fade-in opacity-0 gap-3 group",
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
          "max-w-[80%] rounded-lg px-4 py-2 shadow-lg backdrop-blur-sm relative",
          isUser
            ? "bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white rounded-br-none"
            : "bg-gradient-to-r from-gray-800/90 to-gray-900/90 text-white rounded-bl-none"
        )}
      >
        {!isEditing ? (
          <>
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              {isUser && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-white/10"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-white/10"
                onClick={handleCopy}
              >
                {isCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            {message.attachments?.map((attachment) => renderAttachment(attachment))}
            <div 
              className="text-sm whitespace-pre-wrap leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
            />
          </>
        ) : (
          <div className="space-y-2">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[100px] bg-black/20 border-white/10 text-white resize-none"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setEditedContent(message.content);
                }}
                className="hover:bg-white/10"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveEdit}
                className="bg-white/10 hover:bg-white/20"
              >
                <Check className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
          <User className="h-5 w-5 text-white" />
        </div>
      )}
    </div>
  );
};