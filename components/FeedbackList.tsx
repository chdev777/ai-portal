"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Filter } from "lucide-react";
import { useFeedback } from "@/hooks/use-feedback";
import { FeedbackDetailModal } from "./FeedbackDetailModal";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import type { Feedback } from "@/types/feedback";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";

const STATUS_COLORS = {
  NEW: "bg-blue-100 text-blue-800",
  IN_REVIEW: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  COMPLETED: "bg-purple-100 text-purple-800",
};

const STATUS_LABELS = {
  NEW: "新規",
  IN_REVIEW: "検討中",
  ACCEPTED: "採用",
  REJECTED: "不採用",
  COMPLETED: "対応済み",
};

export function FeedbackList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data, isLoading, mutate } = useFeedback();

  const filteredFeedback = data?.filter((feedback: Feedback) => {
    const matchesSearch = feedback.content
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || feedback.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredFeedback?.map((feedback: Feedback) => (
          <div
            key={feedback.id}
            className="border rounded-lg p-4 hover:bg-accent transition-colors cursor-pointer bg-white"
            onClick={() => setSelectedId(feedback.id)}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="space-y-1">
                <div className="font-medium">
                  {feedback.name || "匿名"}
                  {feedback.department && ` (${feedback.department})`}
                </div>
                <Badge
                  variant="secondary"
                  className={STATUS_COLORS[feedback.status]}
                >
                  {STATUS_LABELS[feedback.status]}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(feedback.createdAt), "yyyy年MM月dd日 HH:mm", {
                  locale: ja,
                })}
              </div>
            </div>
            <p className="text-sm line-clamp-2">{feedback.content}</p>
          </div>
        ))}
      </div>

      {selectedId && (
        <FeedbackDetailModal
          feedbackId={selectedId}
          onClose={() => setSelectedId(null)}
          onUpdate={() => mutate()}
        />
      )}
    </div>
  );
}
