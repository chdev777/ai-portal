"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

type SortOrder =
  | "publishDate"
  | "-publishDate"
  | "publishedDate"
  | "-publishedDate"
  | "title"
  | "-title";

export function SortSelect({
  defaultValue,
  isNews = false,
}: {
  defaultValue: string;
  isNews?: boolean;
}) {
  const router = useRouter();
  const dateField = isNews ? "publishedDate" : "publishDate";

  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(value) => {
        const url = new URL(window.location.href);
        url.searchParams.set("sort", value);
        router.push(url.toString());
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="並び順" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={`-${dateField}`}>投稿日時（新しい順）</SelectItem>
        <SelectItem value={dateField}>投稿日時（古い順）</SelectItem>
        <SelectItem value="title">タイトル（昇順）</SelectItem>
        <SelectItem value="-title">タイトル（降順）</SelectItem>
      </SelectContent>
    </Select>
  );
}
