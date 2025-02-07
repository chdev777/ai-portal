import { prisma } from "@/lib/prisma";
import { checkAuth } from "@/lib/auth-check";
import { UserAppsClient } from "./client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Apps - KGU AI Platform",
  description: "ユーザーアプリケーション一覧",
};

export default async function UserAppsPage() {
  const session = await checkAuth();

  const [apps, userTypes] = await Promise.all([
    prisma.chatApp.findMany({
      where: {
        isAdminOnly: false,
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
    <UserAppsClient
      initialApps={apps}
      userTypes={userTypes}
      session={session}
    />
  );
}
