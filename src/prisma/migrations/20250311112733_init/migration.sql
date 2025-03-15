-- CreateTable
CREATE TABLE "User"
(
    "id"         TEXT NOT NULL,
    "telegramId" TEXT NOT NULL,
    "theme"      TEXT NOT NULL DEFAULT 'light',
    "language"   TEXT NOT NULL DEFAULT 'en',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat"
(
    "id"         SERIAL  NOT NULL,
    "short_name" TEXT    NOT NULL,
    "long_name"  TEXT    NOT NULL,
    "semester"   INTEGER NOT NULL,
    "role"       TEXT    NOT NULL,
    "link"       TEXT    NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChatToUser"
(
    "A" INTEGER NOT NULL,
    "B" TEXT    NOT NULL,

    CONSTRAINT "_ChatToUser_AB_pkey" PRIMARY KEY ("A", "B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramId_key" ON "User" ("telegramId");

-- CreateIndex
CREATE INDEX "_ChatToUser_B_index" ON "_ChatToUser" ("B");

-- AddForeignKey
ALTER TABLE "_ChatToUser"
    ADD CONSTRAINT "_ChatToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Chat" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatToUser"
    ADD CONSTRAINT "_ChatToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
