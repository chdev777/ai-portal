"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateAdminAppDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userTypes: Array<{ id: string; name: string }>;
  isAdminApp?: boolean;
  isUserSuperUser: boolean;
}

interface FormData {
  name: string;
  description: string;
  details: string;
  url: string;
  userTypeIds: string[];
}

export function CreateAdminAppDialog({
  isOpen,
  onClose,
  onSuccess,
  userTypes,
}: CreateAdminAppDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    details: "",
    url: "",
    userTypeIds: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin-apps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          role: "ADMIN",
        }),
      });

      if (!response.ok) {
        throw new Error("アプリの作成に失敗しました");
      }

      toast({
        title: "成功",
        description: "新しいアプリを作成しました",
      });
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "エラー",
        description:
          error instanceof Error
            ? error.message
            : "アプリの作成中にエラーが発生しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新規管理者用アプリの作成</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">名前</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="details">詳細</Label>
            <Textarea
              id="details"
              value={formData.details}
              onChange={(e) =>
                setFormData({ ...formData, details: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>ユーザータイプ</Label>
            <div className="grid grid-cols-2 gap-2">
              {userTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={type.id}
                    checked={formData.userTypeIds.includes(type.id)}
                    onCheckedChange={(checked) => {
                      setFormData((prev) => ({
                        ...prev,
                        userTypeIds: checked
                          ? [...prev.userTypeIds, type.id]
                          : prev.userTypeIds.filter((id) => id !== type.id),
                      }));
                    }}
                  />
                  <Label htmlFor={type.id}>{type.name}</Label>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              作成
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
