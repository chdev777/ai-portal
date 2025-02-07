"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ExtendedUser } from "@/types";
import { UserType } from "@prisma/client";
import { Session } from "next-auth";
import { CreateUserDialog } from "@/components/CreateUserDialog";
import { DeleteDialog } from "@/components/DeleteDialog";
import { EditUserDialog } from "@/components/EditUserDialog";
import { UserCard } from "@/components/UserCard";

interface UsersClientProps {
  initialUsers: ExtendedUser[];
  userTypes: UserType[];
  session: Session;
}

export function UsersClient({
  initialUsers,
  userTypes,
  session,
}: UsersClientProps) {
  const [users, setUsers] = useState<ExtendedUser[]>(initialUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("ユーザーの取得に失敗しました");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast({
        title: "エラー",
        description: "ユーザーの読み込み中にエラーが発生しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleDelete = async (userId: string) => {
    try {
      if (userId === session.user.id) {
        toast({
          title: "エラー",
          description: "自分自身は削除できません",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("ユーザーの削除に失敗しました");

      toast({
        title: "成功",
        description: "ユーザーを削除しました",
      });
      await fetchUsers();
    } catch (error) {
      toast({
        title: "エラー",
        description: "ユーザーの削除中にエラーが発生しました",
        variant: "destructive",
      });
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          新規ユーザー作成
        </Button>
      </div>

      {/* ユーザー一覧 */}
      <div className="grid gap-4">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={() => {
              setSelectedUser(user);
              setIsEditModalOpen(true);
            }}
            onDelete={() => {
              setSelectedUser(user);
              setIsDeleteDialogOpen(true);
            }}
            isCurrentUser={user.id === session.user.id}
          />
        ))}
      </div>

      {/* モーダル類 */}
      <CreateUserDialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchUsers}
        userTypes={userTypes}
      />

      <EditUserDialog
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchUsers}
        user={selectedUser}
        userTypes={userTypes}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => selectedUser && handleDelete(selectedUser.id)}
        title="ユーザーの削除"
        description="このユーザーを削除してもよろしいですか？"
      />
    </div>
  );
}
