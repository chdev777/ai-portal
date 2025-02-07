"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { UserType } from "@prisma/client";
import { CreateUserTypeDialog } from "@/components/CreateUserTypeDialog";
import { EditUserTypeDialog } from "@/components/EditUserTypeDialog";
import { DeleteDialog } from "@/components/DeleteDialog";
import { UserTypeCard } from "@/components/UserTypeCard";

interface UserTypesClientProps {
  initialUserTypes: UserType[];
}

export function UserTypesClient({ initialUserTypes }: UserTypesClientProps) {
  const [userTypes, setUserTypes] = useState<UserType[]>(initialUserTypes);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(
    null
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchUserTypes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user-types");
      if (!response.ok) throw new Error("ユーザータイプの取得に失敗しました");
      const data = await response.json();
      setUserTypes(data);
    } catch (error) {
      toast({
        title: "エラー",
        description: "ユーザータイプの読み込み中にエラーが発生しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleDelete = async (userTypeId: string) => {
    try {
      const checkResponse = await fetch(
        `/api/user-types/${userTypeId}/check-usage`
      );
      const { isInUse } = await checkResponse.json();

      if (isInUse) {
        toast({
          title: "エラー",
          description: "このユーザータイプは使用中のため削除できません",
          variant: "destructive",
        });
        setIsDeleteDialogOpen(false);
        return;
      }

      const response = await fetch(`/api/user-types/${userTypeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("ユーザータイプの削除に失敗しました");
      }

      toast({
        title: "成功",
        description: "ユーザータイプを削除しました",
      });
      await fetchUserTypes();
    } catch (error) {
      toast({
        title: "エラー",
        description: "ユーザータイプの削除中にエラーが発生しました",
        variant: "destructive",
      });
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Types</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          新規ユーザータイプ作成
        </Button>
      </div>

      {/* ユーザータイプ一覧 */}
      <div className="grid gap-4">
        {userTypes.map((userType) => (
          <UserTypeCard
            key={userType.id}
            userType={userType}
            onEdit={() => {
              setSelectedUserType(userType);
              setIsEditModalOpen(true);
            }}
            onDelete={() => {
              setSelectedUserType(userType);
              setIsDeleteDialogOpen(true);
            }}
          />
        ))}
      </div>

      {/* モーダル類 */}
      <CreateUserTypeDialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchUserTypes}
      />

      <EditUserTypeDialog
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchUserTypes}
        userType={selectedUserType}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => selectedUserType && handleDelete(selectedUserType.id)}
        title="ユーザータイプの削除"
        description="このユーザータイプを削除してもよろしいですか？"
      />
    </div>
  );
}
