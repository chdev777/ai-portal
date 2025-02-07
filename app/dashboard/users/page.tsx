import { checkSuperUserAuth } from "@/lib/auth-check";
import { prisma } from "@/lib/prisma";
import { UsersClient } from "./client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users - KGU AI Platform",
  description: "ユーザー管理",
};

export default async function UsersPage() {
  const session = await checkSuperUserAuth();

  const [users, userTypes] = await Promise.all([
    prisma.user.findMany({
      include: {
        userType: true,
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
    <UsersClient initialUsers={users} userTypes={userTypes} session={session} />
  );
}
