import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AppDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  app: {
    name: string;
    details: string | null;
  };
}

export function AppDetailsModal({
  isOpen,
  onClose,
  app,
}: AppDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{app.name}</DialogTitle>
        </DialogHeader>
        <div className="prose max-w-none overflow-y-auto mt-4 flex-grow">
          <p className="whitespace-pre-wrap">{app.details}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
