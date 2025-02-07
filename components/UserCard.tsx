"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExtendedUser } from "@/types";

interface UserCardProps {
  user: ExtendedUser;
  onEdit: () => void;
  onDelete: () => void;
  isCurrentUser: boolean;
}

export function UserCard({
  user,
  onEdit,
  onDelete,
  isCurrentUser,
}: UserCardProps) {
  return (
    <Card className="hover:bg-accent/5 transition-colors">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{user.username}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              編集
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              disabled={isCurrentUser}
            >
              削除
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">権限: {user.role}</p>
          <p className="text-sm text-muted-foreground">
            ユーザータイプ: {user.userType.name}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
