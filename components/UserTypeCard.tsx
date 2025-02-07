"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserType } from "@prisma/client";

interface UserTypeCardProps {
  userType: UserType;
  onEdit: () => void;
  onDelete: () => void;
}

export function UserTypeCard({
  userType,
  onEdit,
  onDelete,
}: UserTypeCardProps) {
  return (
    <Card className="hover:bg-accent/5 transition-colors">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{userType.name}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              編集
            </Button>
            <Button variant="destructive" size="sm" onClick={onDelete}>
              削除
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          作成日: {new Date(userType.createdAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}
