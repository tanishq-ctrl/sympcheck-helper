import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const MedicalDisclaimer = () => {
  return (
    <Alert variant="destructive" className="bg-warning text-warning-foreground">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        This is an AI assistant and does not replace professional medical advice.
        Always consult a healthcare provider for medical decisions.
      </AlertDescription>
    </Alert>
  );
};