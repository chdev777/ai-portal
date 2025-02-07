import { Metadata } from "next";
import { FeedbackList } from "@/components/FeedbackList";

export const metadata: Metadata = {
  title: "意見・要望一覧",
};

export default function FeedbackPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">意見・要望一覧</h1>
      <FeedbackList />
    </div>
  );
}
