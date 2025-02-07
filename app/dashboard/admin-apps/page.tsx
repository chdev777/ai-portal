import { prisma } from "@/lib/prisma";
import { AdminAppsClient } from "./client";
import { Metadata } from "next";
import { checkAdminAuth } from "@/lib/auth-check";

export const metadata: Metadata = {
  title: "Admin Apps - KGU AI Platform",
  description: "管理者アプリケーション一覧",
};

export default async function AdminAppsPage() {
  const session = await checkAdminAuth();

  const [apps, userTypes] = await Promise.all([
    prisma.chatApp.findMany({
      where: {
        isAdminOnly: true,
      },
      include: {
        userTypes: true,
        createdBy: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    }),
    prisma.userType.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);

  return (
    <AdminAppsClient
      initialApps={apps}
      userTypes={userTypes}
      session={session}
    />
  );
}
