"use client";

import { Category } from "@/lib/microcms";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function CategoryTabs({
  categories,
  currentCategory,
}: {
  categories: Category[];
  currentCategory?: Category;
}) {
  const router = useRouter();
  const uniqueCategories = Array.from(new Set(categories));

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={!currentCategory ? "default" : "outline"}
        onClick={() => {
          const url = new URL(window.location.href);
          url.searchParams.delete("category");
          router.push(url.toString());
        }}
      >
        すべて
      </Button>
      {uniqueCategories.map((category) => (
        <Button
          key={category}
          variant={currentCategory === category ? "default" : "outline"}
          onClick={() => {
            const url = new URL(window.location.href);
            url.searchParams.set("category", category);
            router.push(url.toString());
          }}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
