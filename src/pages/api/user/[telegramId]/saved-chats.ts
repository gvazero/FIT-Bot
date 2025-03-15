import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { telegramId } = req.query;

  if (typeof telegramId !== "string") {
    return res.status(400).json({ error: "Invalid Telegram ID" });
  }

  if (req.method === "PUT") {
    try {
      const { savedChatsIds } = req.body;

      if (!Array.isArray(savedChatsIds)) {
        return res.status(400).json({ error: "Invalid savedChatsIds format" });
      }

      const updatedUser = await prisma.user.update({
        where: { telegramId },
        data: {
          savedChats: { set: savedChatsIds } // Proper way to update array fields
        }
      });
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating saved chats:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}