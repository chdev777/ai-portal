"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import type { Feedback } from "@/types/feedback";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useToast } from "./ui/use-toast";
import { FeedbackStatus } from "@prisma/client";

const STATUS_LABELS: Record<FeedbackStatus, string> = {
  NEW: "新規",
  IN_REVIEW: "検討中",
  ACCEPTED: "採用",
  REJECTED: "不採用",
  COMPLETED: "対応済み",
};

type FeedbackDetailModalProps = {
  feedbackId: string;
  onClose: () => void;
  onUpdate: () => void;
};

export function FeedbackDetailModal({
  feedbackId,
  onClose,
  onUpdate,
}: FeedbackDetailModalProps) {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchFeedbackDetail();
  }, [feedbackId]);

  async function fetchFeedbackDetail() {
    try {
      const response = await fetch(`/api/feedback/${feedbackId}`);
      if (!response.ok) throw new Error("フィードバックの取得に失敗しました");
      const data = await response.json();
      setFeedback(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateStatus(newStatus: FeedbackStatus) {
    setIsUpdating(true);
    try {
      console.log("Sending status update:", newStatus);

      const response = await fetch(`/api/feedback/${feedbackId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "更新に失敗しました");
      }

      const updatedFeedback = await response.json();
      console.log("Updated feedback:", updatedFeedback);

      toast({
        title: "更新完了",
        description: "ステータスを更新しました。",
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "エラー",
        description:
          error instanceof Error ? error.message : "更新に失敗しました。",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading || !feedback) {
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>投稿詳細</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">ステータス</div>
            <Select
              value={feedback.status}
              onValueChange={updateStatus}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">投稿日時</div>
            <div>
              {format(new Date(feedback.createdAt), "yyyy年MM月dd日 HH:mm", {
                locale: ja,
              })}
            </div>
          </div>
          {feedback.department && (
            <div>
              <div className="text-sm text-muted-foreground mb-1">部署</div>
              <div>{feedback.department}</div>
            </div>
          )}
          {feedback.name && (
            <div>
              <div className="text-sm text-muted-foreground mb-1">氏名</div>
              <div>{feedback.name}</div>
            </div>
          )}
          <div>
            <div className="text-sm text-muted-foreground mb-1">内容</div>
            <div className="whitespace-pre-wrap">{feedback.content}</div>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <Button onClick={onClose}>閉じる</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
