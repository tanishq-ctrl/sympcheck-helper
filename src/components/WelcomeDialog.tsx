import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PatientDetailsDialog } from "@/components/PatientDetailsDialog";

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPatientDetailsSubmitted: () => void;
}

export const WelcomeDialog = ({
  open,
  onOpenChange,
  onPatientDetailsSubmitted,
}: WelcomeDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to HealthAssist! 👨‍⚕️
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 dark:text-gray-300">
            Let us help you feel better! 😊
          </DialogDescription>
        </DialogHeader>
        <PatientDetailsDialog onSubmitted={onPatientDetailsSubmitted} />
      </DialogContent>
    </Dialog>
  );
};