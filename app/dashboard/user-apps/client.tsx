"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ExtendedChatApp } from "@/types";
import { UserType } from "@prisma/client";
import { Session } from "next-auth";
import { ChatAppModal } from "@/components/ChatAppModal";
import { CreateAppDialog } from "@/components/CreateAppDialog";
import { EditAppDialog } from "@/components/EditAppDialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { AppCard } from "@/components/AppCard";
import { DeleteDialog } from "@/components/DeleteDialog";

interface UserAppsClientProps {
  initialApps: ExtendedChatApp[];
  userTypes: UserType[];
  session: Session;
}

export function UserAppsClient({
  initialApps,
  userTypes,
  session,
}: UserAppsClientProps) {
  const [apps, setApps] = useState<ExtendedChatApp[]>(initialApps);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedApp, setSelectedApp] = useState<ExtendedChatApp | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"createdAt" | "name" | "userType">(
    "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { toast } = useToast();

  const isUserSuperUser = session?.user?.role === "SUPERUSER";
  const isAdmin = ["ADMIN", "SUPERUSER"].includes(session?.user?.role || "");

  // フィルタリングとソートを適用
  const filteredAndSortedApps = useMemo(() => {
    let result = [...apps];

    // フィルタリング
    if (isUserSuperUser) {
      // 全て表示の場合はフィルタリングしない
      if (selectedUserType && selectedUserType !== "all") {
        result = result.filter(
          (app) =>
            app.userTypes.some((type) => type.id === selectedUserType) ||
            app.isVisibleToAll
        );
      }
    } else if (isAdmin) {
      result = result.filter(
        (app) =>
          app.isVisibleToAll ||
          app.userTypes.some((type) => type.id === session.user.userType)
      );
    } else {
      result = result.filter(
        (app) =>
          app.isVisibleToAll ||
          app.userTypes.some((type) => type.id === session.user.userType)
      );
    }

    // ソート
    return result.sort((a, b) => {
      switch (sortBy) {
        case "createdAt":
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;

        case "name":
          return sortOrder === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);

        case "userType":
          const userTypesA = a.isVisibleToAll
            ? "全て"
            : a.userTypes.map((t) => t.name).join(", ");
          const userTypesB = b.isVisibleToAll
            ? "全て"
            : b.userTypes.map((t) => t.name).join(", ");
          return sortOrder === "asc"
            ? userTypesA.localeCompare(userTypesB)
            : userTypesB.localeCompare(userTypesA);

        default:
          return 0;
      }
    });
  }, [
    apps,
    selectedUserType,
    sortBy,
    sortOrder,
    isUserSuperUser,
    isAdmin,
    session.user.userType,
  ]);

  const fetchApps = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/chat-apps");
      if (!response.ok) throw new Error("アプリの取得に失敗しました");
      const data = await response.json();
      const userApps = data.filter((app: ExtendedChatApp) => !app.isAdminOnly);
      setApps(userApps);
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
      fetchApps();
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
    if (isUserSuperUser) return true;
    if (isAdmin) return app.createdById === session.user.id;
    return false;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">ユーザーアプリ</h1>
        {isAdmin && (
          <Button onClick={() => setIsCreateModalOpen(true)}>
            新規アプリ作成
          </Button>
        )}
      </div>

      <div className="flex gap-4 mb-6">
        {isUserSuperUser && (
          <Select
            value={selectedUserType || "all"}
            onValueChange={setSelectedUserType}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="全て表示" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全て表示</SelectItem>
              {userTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select
          value={sortBy}
          onValueChange={(value: "createdAt" | "name" | "userType") =>
            setSortBy(value)
          }
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="ソート項目" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">作成日時</SelectItem>
            <SelectItem value="name">アプリ名</SelectItem>
            <SelectItem value="userType">ユーザータイプ</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortOrder}
          onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="ソート順" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">昇順</SelectItem>
            <SelectItem value="desc">降順</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedApps.map((app) => (
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

      <CreateAppDialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchApps}
        userTypes={userTypes}
        isUserSuperUser={isUserSuperUser}
      />

      <EditAppDialog
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchApps}
        app={selectedApp}
        userTypes={userTypes}
        isUserSuperUser={isUserSuperUser}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => selectedApp && handleDelete(selectedApp.id)}
        title="アプリの削除"
        description="このアプリを削除してもよろしいですか？"
      />
    </div>
  );
}
