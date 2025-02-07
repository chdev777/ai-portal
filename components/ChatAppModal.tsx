"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExtendedChatApp } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RichTextEditor } from "@/components/RichTextEditor";

interface ChatAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  app: ExtendedChatApp | null;
}

export function ChatAppModal({ isOpen, onClose, app }: ChatAppModalProps) {
  if (!app) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{app.name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {app.details && (
              <div>
                <h3 className="text-lg font-semibold mb-3">詳細説明</h3>
                <div className="text-muted-foreground">
                  <RichTextEditor
                    content={app.details}
                    editable={false}
                    onChange={() => {}}
                  />
                </div>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold mb-2">作成者</h3>
              <p className="text-muted-foreground">{app.createdBy.username}</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
