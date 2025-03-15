-- DropIndex
DROP INDEX "Chat_short_name_idx";

-- CreateIndex
CREATE INDEX "Chat_short_name_semester_idx" ON "Chat" ("short_name", "semester");

-- CreateIndex
CREATE INDEX "User_telegramId_idx" ON "User" ("telegramId");
