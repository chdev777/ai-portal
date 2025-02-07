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
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { ChatApp } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { RichTextEditor } from "@/components/RichTextEditor";
import Link from "@tiptap/extension-link";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";

// ChatApp型を拡張して定義
export interface ExtendedChatApp {
  id: string;
  name: string;
  description: string;
  url: string;
  isVisibleToAll: boolean;
  userTypes: Array<{ id: string; name: string }>;
  createdBy: { username: string; id: string };
  createdById: string;
  details: string | null;
  createdAt: Date;
  updatedAt: Date;
  isAdminOnly: boolean;
}

interface EditAppDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  app: ExtendedChatApp | null;
  userTypes: Array<{ id: string; name: string }>;
  isUserSuperUser: boolean;
}

interface FormData {
  name: string;
  description: string;
  details: string;
  url: string;
  isVisibleToAll: boolean;
  userTypeIds: string[];
  isDirty: boolean;
}

export function EditAppDialog({
  isOpen,
  onClose,
  onSuccess,
  app,
  userTypes,
  isUserSuperUser,
}: EditAppDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    details: "",
    url: "",
    isVisibleToAll: false,
    userTypeIds: [],
    isDirty: false,
  });
  const [tempDetails, setTempDetails] = useState<string>("");
  const { toast } = useToast();

  // フォームの初期化
  useEffect(() => {
    if (app) {
      setFormData({
        name: app.name,
        description: app.description,
        details: app.details || "",
        url: app.url,
        isVisibleToAll: app.isVisibleToAll,
        userTypeIds: app.userTypes.map((type) => type.id),
        isDirty: false,
      });
      setTempDetails(app.details || "");
    }
  }, [app]);

  // tempDetailsの変更を監視して isDirty を更新
  useEffect(() => {
    if (app && tempDetails !== app.details) {
      setFormData((prev) => ({
        ...prev,
        isDirty: true,
      }));
    }
  }, [tempDetails, app]);

  // フォームの変更を処理する関数（details以外）
  const handleFormChange = (
    field: keyof Omit<FormData, "isDirty" | "details">,
    value: string | boolean | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      isDirty: true,
    }));
  };

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("フォームが送信されました"); // デバッグログ
    if (!app || !formData.isDirty) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/chat-apps/${app.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          details: tempDetails,
        }),
      });

      if (!response.ok) throw new Error("アプリの更新に失敗しました");

      toast({
        title: "成功",
        description: "アプリを更新しました",
      });
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "エラー",
        description:
          error instanceof Error
            ? error.message
            : "アプリの更新中にエラーが発生しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>アプリの編集</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(80vh-8rem)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">名前</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">説明</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleFormChange("description", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="details">詳細</Label>
                <RichTextEditor
                  content={formData.details}
                  onChange={(content) => {
                    setTempDetails(content);
                    setFormData((prev) => ({
                      ...prev,
                      isDirty: true,
                    }));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => handleFormChange("url", e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isVisibleToAll"
                  checked={formData.isVisibleToAll}
                  onCheckedChange={(checked) =>
                    handleFormChange("isVisibleToAll", checked)
                  }
                  disabled={!isUserSuperUser}
                />
                <Label htmlFor="isVisibleToAll">全ユーザーに表示</Label>
              </div>
              {!formData.isVisibleToAll && (
                <div className="space-y-2">
                  <Label>アクセス可能なユーザータイプ</Label>
                  <ScrollArea className="h-[200px] border rounded-md p-4">
                    <div className="space-y-2">
                      {userTypes.map((type) => (
                        <div
                          key={type.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={type.id}
                            checked={formData.userTypeIds.includes(type.id)}
                            onCheckedChange={(checked) => {
                              const newUserTypeIds = checked
                                ? [...formData.userTypeIds, type.id]
                                : formData.userTypeIds.filter(
                                    (id) => id !== type.id
                                  );
                              handleFormChange("userTypeIds", newUserTypeIds);
                            }}
                          />
                          <Label htmlFor={type.id}>{type.name}</Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isLoading || !formData.isDirty}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                更新
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
