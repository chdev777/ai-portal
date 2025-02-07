import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");
  return session;
}

export async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "SUPERUSER"].includes(session.user.role)) {
    redirect("/dashboard");
  }
  return session;
}

export async function checkSuperUserAuth() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SUPERUSER") {
    redirect("/dashboard");
  }
  return session;
}
