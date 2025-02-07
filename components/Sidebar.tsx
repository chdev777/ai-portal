"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Home,
  AppWindow,
  Users,
  Settings,
  Lightbulb,
  Bell,
  BookOpen,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

type SidebarProps = {
  user: {
    role: string;
  } | null;
};

export function Sidebar({ user }: SidebarProps) {
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (!user) {
    return null;
  }

  const isSuperUser = user.role === "SUPERUSER";
  const isAdmin = ["ADMIN", "SUPERUSER"].includes(user.role);

  const MenuContent = () => (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-4 px-4 text-lg font-semibold text-gray-900">Menu</h2>
        <div className="space-y-2">
          <Button
            asChild
            variant="ghost"
            className={cn(
              "w-full justify-start font-bold hover:bg-sky-50 hover:text-sky-700",
              pathname === "/dashboard" && "bg-sky-50 text-sky-700"
            )}
          >
            <Link href="/dashboard" className="flex items-center gap-3">
              <Home className="h-5 w-5" />
              お知らせ・ニュース
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className={cn(
              "w-full justify-start font-bold hover:bg-sky-50 hover:text-sky-700",
              pathname === "/dashboard/blogs" && "bg-sky-50 text-sky-700"
            )}
          >
            <Link href="/dashboard/blogs" className="flex items-center gap-3">
              <BookOpen className="h-5 w-5" />
              ブログ記事
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className={cn(
              "w-full justify-start font-bold hover:bg-sky-50 hover:text-sky-700",
              pathname === "/dashboard/user-apps" && "bg-sky-50 text-sky-700"
            )}
          >
            <Link
              href="/dashboard/user-apps"
              className="flex items-center gap-3"
            >
              <AppWindow className="h-5 w-5" />
              アプリ
            </Link>
          </Button>
          {isAdmin && (
            <Button
              asChild
              variant="ghost"
              className={cn(
                "w-full justify-start font-bold hover:bg-sky-50 hover:text-sky-700",
                pathname === "/dashboard/admin-apps" && "bg-sky-50 text-sky-700"
              )}
            >
              <Link
                href="/dashboard/admin-apps"
                className="flex items-center gap-3"
              >
                <Settings className="h-5 w-5" />
                管理者アプリ
              </Link>
            </Button>
          )}
          {isSuperUser && (
            <>
              <Button
                asChild
                variant="ghost"
                className={cn(
                  "w-full justify-start font-bold hover:bg-sky-50 hover:text-sky-700",
                  pathname === "/dashboard/users" && "bg-sky-50 text-sky-700"
                )}
              >
                <Link
                  href="/dashboard/users"
                  className="flex items-center gap-3"
                >
                  <Users className="h-5 w-5" />
                  ユーザー
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className={cn(
                  "w-full justify-start font-bold hover:bg-sky-50 hover:text-sky-700",
                  pathname === "/dashboard/user-types" &&
                    "bg-sky-50 text-sky-700"
                )}
              >
                <Link
                  href="/dashboard/user-types"
                  className="flex items-center gap-3"
                >
                  <Settings className="h-5 w-5" />
                  ユーザータイプ
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className={cn(
                  "w-full justify-start font-bold hover:bg-sky-50 hover:text-sky-700",
                  pathname === "/dashboard/feedback" && "bg-sky-50 text-sky-700"
                )}
              >
                <Link
                  href="/dashboard/feedback"
                  className="flex items-center gap-3"
                >
                  <Lightbulb className="h-5 w-5" />
                  意見・要望
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 bg-white p-0">
          <MenuContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="hidden md:block pb-12 w-64 border-r bg-white">
      <MenuContent />
    </div>
  );
}
