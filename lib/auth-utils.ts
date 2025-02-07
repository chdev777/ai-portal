import { Role } from "@prisma/client";
import { Session } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function validateUserRole(session: Session | null): Promise<Role> {
  if (!session?.user?.id) return "USER";

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  return user?.role || "USER";
}

export async function isSuperUser(session: Session | null): Promise<boolean> {
  const role = await validateUserRole(session);
  return role === "SUPERUSER";
}

export async function isAdmin(session: Session | null): Promise<boolean> {
  const role = await validateUserRole(session);
  return role === "ADMIN" || role === "SUPERUSER";
}
