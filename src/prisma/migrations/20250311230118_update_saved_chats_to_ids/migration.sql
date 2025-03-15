-- AlterTable
ALTER TABLE "User"
    ALTER COLUMN "savedChats" SET DEFAULT ARRAY[]::INTEGER[];
