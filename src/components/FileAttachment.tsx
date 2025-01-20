import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, File, Image, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface FileAttachmentProps {
  messageId: string;
  onUploadComplete: (filePath: string, fileName: string) => void;
}

export const FileAttachment = ({ messageId, onUploadComplete }: FileAttachmentProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('messageId', messageId);

    try {
      const { data, error } = await supabase.functions.invoke('upload', {
        body: formData,
      });

      if (error) throw error;

      onUploadComplete(data.filePath, data.fileName);
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload file",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileUpload}
        accept="image/*,.pdf"
        disabled={isUploading}
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer"
      >
        <Button 
          variant="ghost" 
          size="icon"
          disabled={isUploading}
          className="hover:bg-gray-800/50"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Paperclip className="h-4 w-4" />
          )}
        </Button>
      </label>
    </div>
  );
};