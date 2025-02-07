-- CreateTable
ALTER TABLE IF NOT EXISTS "public"."Feedback" ADD COLUMN IF NOT EXISTS
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "department" TEXT,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id"); 