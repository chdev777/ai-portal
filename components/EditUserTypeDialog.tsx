"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface UserType {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface EditUserTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userType: UserType | null;
}

export function EditUserTypeDialog({
  isOpen,
  onClose,
  onSuccess,
  userType,
}: EditUserTypeDialogProps) {
  const [name, setName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (userType) {
      setName(userType.name);
    }
  }, [userType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/user-types/${userType?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error("ユーザータイプの更新に失敗しました");

      toast({
        title: "成功",
        description: "ユーザータイプを更新しました",
      });
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "エラー",
        description: "ユーザータイプの更新中にエラーが発生しました",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ユーザータイプ編集</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">名前</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <Button type="submit">更新</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
