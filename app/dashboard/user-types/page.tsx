import { prisma } from "@/lib/prisma";
import { checkSuperUserAuth } from "@/lib/auth-check";
import { UserTypesClient } from "./client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Types - KGU AI Platform",
  description: "ユーザータイプ管理",
};

export default async function UserTypesPage() {
  const session = await checkSuperUserAuth();

  const userTypes = await prisma.userType.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return <UserTypesClient initialUserTypes={userTypes} />;
}
