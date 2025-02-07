import { FeedbackStatus } from "@prisma/client";

export type Feedback = {
  id: string;
  content: string;
  department?: string;
  name?: string;
  status: FeedbackStatus;
  createdAt: string;
};
