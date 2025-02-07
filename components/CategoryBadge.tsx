"use client";

import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/microcms";

export function CategoryBadge({ category }: { category: Category }) {
  const router = useRouter();

  return (
    <Badge
      variant="secondary"
      className="cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        const url = new URL(window.location.href);
        url.searchParams.set("category", category);
        router.push(url.toString());
      }}
    >
      {category}
    </Badge>
  );
}
