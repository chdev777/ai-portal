"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const TIMEOUT_DURATION = 30 * 60 * 1000; // 30分
const WARNING_BEFORE_TIMEOUT = 1 * 60 * 1000; // 1分前に警告

export function SessionTimeout() {
  const { data: session } = useSession();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningRef = useRef<NodeJS.Timeout>();
  const countdownRef = useRef<NodeJS.Timeout>();
  const pathname = usePathname();

  const resetTimers = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    if (session) {
      warningRef.current = setTimeout(() => {
        setShowWarning(true);
        setCountdown(60);

        countdownRef.current = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, TIMEOUT_DURATION - WARNING_BEFORE_TIMEOUT);

      timeoutRef.current = setTimeout(() => {
        signOut({ callbackUrl: "/login" });
      }, TIMEOUT_DURATION);
    }
  };

  const memoizedResetTimers = useCallback(resetTimers, [session]);

  useEffect(() => {
    memoizedResetTimers();

    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
    ];

    const resetOnActivity = () => {
      memoizedResetTimers();
    };

    events.forEach((event) => {
      document.addEventListener(event, resetOnActivity);
    });

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);

      events.forEach((event) => {
        document.removeEventListener(event, resetOnActivity);
      });
    };
  }, [session, pathname, memoizedResetTimers]);

  const handleStayLoggedIn = () => {
    setShowWarning(false);
    resetTimers();
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  if (!session || pathname === "/login") return null;

  return (
    <Dialog open={showWarning} onOpenChange={setShowWarning}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>セッションタイムアウト警告</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>
            {countdown}秒後にセッションが終了します。
            <br />
            ログインを継続しますか？
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleLogout}>
            ログアウト
          </Button>
          <Button onClick={handleStayLoggedIn}>継続する</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
