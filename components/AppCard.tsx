"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExtendedChatApp } from "@/types";

interface AppCardProps {
  app: ExtendedChatApp;
  onOpen: () => void;
  onDetails: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}

export function AppCard({
  app,
  onOpen,
  onDetails,
  onEdit,
  onDelete,
  isAdmin,
}: AppCardProps) {
  return (
    <Card className="hover:bg-accent/5 transition-colors">
      <CardHeader>
        <CardTitle>{app.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{app.description}</p>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={onOpen}>
            アプリを開く
          </Button>
          <Button variant="outline" size="sm" onClick={onDetails}>
            詳細説明
          </Button>
          {isAdmin && (
            <>
              <Button variant="outline" size="sm" onClick={onEdit}>
                編集
              </Button>
              <Button variant="destructive" size="sm" onClick={onDelete}>
                削除
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
