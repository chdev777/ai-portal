"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ExtendedChatApp } from "@/types";
import { UserType } from "@prisma/client";
import { Session } from "next-auth";
import { ChatAppModal } from "@/components/ChatAppModal";
import { CreateAdminAppDialog } from "@/components/CreateAdminAppDialog";
import { EditAppDialog } from "@/components/EditAppDialog";
import { AppCard } from "@/components/AppCard";
import { DeleteDialog } from "@/components/DeleteDialog";
import { CreateAppDialog } from "@/components/CreateAppDialog";

interface AdminAppsClientProps {
  initialApps: ExtendedChatApp[];
  userTypes: UserType[];
  session: Session;
}

export function AdminAppsClient({
  initialApps,
  userTypes,
  session,
}: AdminAppsClientProps) {
  const [apps, setApps] = useState<ExtendedChatApp[]>(initialApps);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedApp, setSelectedApp] = useState<ExtendedChatApp | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const isSuperUser = session?.user?.role === "SUPERUSER";

  const fetchAdminApps = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/chat-apps?type=admin");
      if (!response.ok) throw new Error("アプリの取得に失敗しました");
      const data = await response.json();
      setApps(data);
    } catch (error) {
      toast({
        title: "エラー",
        description: "アプリの読み込み中にエラーが発生しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/chat-apps/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("アプリの削除に失敗しました");

      toast({
        title: "成功",
        description: "アプリを削除しました",
      });
      fetchAdminApps();
    } catch (error) {
      toast({
        title: "エラー",
        description: "アプリの削除中にエラーが発生しました",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  // 編集・削除権限のチェック
  const canManageApp = (app: ExtendedChatApp) => {
    if (isSuperUser) return true;
    return app.createdById === session.user.id;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">管理者アプリ</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          新規アプリ作成
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app) => (
          <AppCard
            key={app.id}
            app={app}
            onOpen={() => window.open(app.url, "_blank")}
            onDetails={() => {
              setSelectedApp(app);
              setIsDetailsModalOpen(true);
            }}
            onEdit={
              canManageApp(app)
                ? () => {
                    setSelectedApp(app);
                    setIsEditModalOpen(true);
                  }
                : undefined
            }
            onDelete={
              canManageApp(app)
                ? () => {
                    setSelectedApp(app);
                    setIsDeleteDialogOpen(true);
                  }
                : undefined
            }
            isAdmin={canManageApp(app)}
          />
        ))}
      </div>

      <ChatAppModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        app={selectedApp}
      />

      <CreateAdminAppDialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchAdminApps}
        userTypes={userTypes}
        isUserSuperUser={isSuperUser}
        isAdminApp={true}
      />

      <EditAppDialog
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchAdminApps}
        app={selectedApp}
        userTypes={userTypes}
        isUserSuperUser={isSuperUser}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => selectedApp && handleDelete(selectedApp.id)}
        title="管理者アプリの削除"
        description="この管理者アプリを削除してもよろしいですか？"
      />

      <CreateAppDialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchAdminApps}
        userTypes={userTypes}
        isAdminApp={true}
        isUserSuperUser={isSuperUser}
      />
    </div>
  );
}
