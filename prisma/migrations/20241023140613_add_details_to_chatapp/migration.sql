-- CreateEnum
CREATE TYPE "AppType" AS ENUM ('ADMIN', 'USER');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SUPERUSER';

-- AlterTable
ALTER TABLE "ChatApp" ADD COLUMN     "details" TEXT;
