"use client";

import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/MultiSelect";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { RichTextEditor } from "@/components/RichTextEditor";

interface CreateAppDialogProps {
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
  isVisibleToAll: boolean;
  userTypeIds: string[];
  isAdminOnly: boolean;
  role: string;
}

export function CreateAppDialog({
  isOpen,
  onClose,
  onSuccess,
  userTypes,
  isAdminApp,
  isUserSuperUser,
}: CreateAppDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    details: "",
    url: "",
    isVisibleToAll: true,
    userTypeIds: [],
    isAdminOnly: false,
    role: "USER", // デフォルトでUSERに固定
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // isVisibleToAllがtrueの場合、userTypeIdsをリセット
  useEffect(() => {
    if (formData.isVisibleToAll) {
      setFormData((prev) => ({
        ...prev,
        userTypeIds: [],
      }));
    }
  }, [formData.isVisibleToAll]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat-apps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "アプリの作成に失敗しました");
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
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>新規アプリ作成</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">アプリ名</Label>
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
          <div>
            <Label 
              htmlFor="details" 
              className="text-sm font-medium mb-1.5 block"
            >
              詳細説明
            </Label>
            <div className="mt-1.5">
              <RichTextEditor
                content={formData.details}
                onChange={(content) => setFormData({ ...formData, details: content })}
              />
            </div>
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
          <div className="flex items-center space-x-2">
            <Switch
              id="isVisibleToAll"
              checked={formData.isVisibleToAll}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isVisibleToAll: checked })
              }
            />
            <Label htmlFor="isVisibleToAll">全ユーザーに表示</Label>
          </div>
          {!formData.isVisibleToAll && (
            <div className="space-y-2">
              <Label>アクセス可能なユーザータイプ</Label>
              <ScrollArea className="h-[200px] border rounded-md p-4">
                <div className="space-y-2">
                  {userTypes.map(
                    (type) =>
                      type.id && (
                        <div
                          key={type.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={type.id}
                            checked={formData.userTypeIds.includes(type.id)}
                            onCheckedChange={(checked) => {
                              setFormData((prev) => ({
                                ...prev,
                                userTypeIds: checked
                                  ? [...prev.userTypeIds, type.id]
                                  : prev.userTypeIds.filter(
                                      (id) => id !== type.id
                                    ),
                              }));
                            }}
                          />
                          <Label htmlFor={type.id}>{type.name}</Label>
                        </div>
                      )
                  )}
                </div>
              </ScrollArea>
              {formData.userTypeIds.length >= 20 && (
                <p className="text-sm text-muted-foreground">
                  最大選択数（20）に達しました
                </p>
              )}
            </div>
          )}
          <div className="sticky bottom-0 bg-background pt-4 mt-4">
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                作成
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
