"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function ImportantFilter({ isActive }: { isActive: boolean }) {
  const router = useRouter();

  return (
    <Button
      variant={isActive ? "default" : "outline"}
      onClick={() => {
        const url = new URL(window.location.href);
        url.searchParams.set("important", (!isActive).toString());
        router.push(url.toString());
      }}
    >
      重要なお知らせのみ表示
    </Button>
  );
}
