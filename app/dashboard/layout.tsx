import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getCurrentUser, getUserWithPermissions } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";
import { UserNav } from "@/components/UserNav";
import { FeedbackButton } from "@/components/FeedbackButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  const permissions = await getUserWithPermissions().catch(() => {
    redirect("/login");
    return null;
  });

  if (!permissions) {
    redirect("/login");
  }

  const pathname = headers().get("x-pathname") || "";

  if (pathname.includes("/dashboard/users") && !permissions.isSuperUser) {
    redirect("/dashboard");
  }

  if (pathname.includes("/dashboard/user-types") && !permissions.isSuperUser) {
    redirect("/dashboard");
  }

  if (pathname.includes("/dashboard/admin-apps") && !permissions.isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-white px-6 shadow-sm">
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          </div>
          <UserNav user={permissions.user} />
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
          <div className="mx-auto max-w-7xl">{children}</div>
          <FeedbackButton />
        </main>
      </div>
    </div>
  );
}
