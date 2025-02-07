import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();

  if (!session?.user) {
    return null;
  }

  const userWithRole = {
    ...session.user,
    role: session.user.role || "USER",
  };

  return userWithRole;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function getUserWithPermissions() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const isSuperUser = session.user.role === "SUPERUSER";
  const isAdmin = ["ADMIN", "SUPERUSER"].includes(session.user.role);

  return {
    user: session.user,
    isSuperUser,
    isAdmin,
  };
}

export function checkPermission(user: any, requiredRole: string[]) {
  return user && requiredRole.includes(user.role);
}
