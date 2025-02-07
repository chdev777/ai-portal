"use client";

import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import { useState } from "react";
import { FeedbackModal } from "./FeedbackModal";

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 gap-2 shadow-lg text-lg py-6 px-6 bg-sky-500 hover:bg-sky-600 transition-all hover:scale-105 text-white"
      >
        <Lightbulb className="h-6 w-6 animate-pulse" />
        アイディア募集！！
      </Button>
      <FeedbackModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
