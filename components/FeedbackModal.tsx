"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { Lightbulb, Sparkles } from "lucide-react";

type FeedbackModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function FeedbackModal({ open, onOpenChange }: FeedbackModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const content = formData.get("content") as string;
    const department = formData.get("department") as string;
    const name = formData.get("name") as string;

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          department,
          name,
        }),
      });

      if (!response.ok) throw new Error("送信に失敗しました");

      toast({
        title: "送信完了",
        description: "ご意見ありがとうございました。",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "エラー",
        description: "送信に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Lightbulb className="h-6 w-6 text-sky-500" />
            あなたのアイディアをお聞かせください
          </DialogTitle>
          <p className="text-muted-foreground mt-2">
            サービスをより良くするためのアイディアをお待ちしています！
            <br />
            些細なことでも構いません。
            <br />
            こんな機能を実現したいなど、気軽に投稿してください！
          </p>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="content"
              className="text-lg flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-sky-500" />
              アイディア内容 *
            </Label>
            <Textarea
              id="content"
              name="content"
              required
              placeholder="「こんな機能があったら便利！」「ここをこう変えたら使いやすそう！」など、自由にご記入ください"
              className="min-h-[150px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">部署（任意）</Label>
              <Input id="department" name="department" placeholder="所属部署" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">お名前（任意）</Label>
              <Input id="name" name="name" placeholder="お名前" />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-sky-500 hover:bg-sky-600"
            >
              {isLoading ? "送信中..." : "送信"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
