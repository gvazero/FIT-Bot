/**
 * API route for managing a user's saved chats
 * 
 * This endpoint allows updating the list of saved chats for a specific user
 * identified by their Telegram ID.
 */

import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * PUT /api/user/[telegramId]/saved-chats
 * 
 * Updates a user's saved chats list
 * 
 * @param {NextApiRequest} req - The request object containing telegramId in query and savedChatsIds in body
 * @param {NextApiResponse} res - The response object
 * @returns {Promise<void>} - Returns the updated user object or an error
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { telegramId } = req.query;

  if (typeof telegramId !== "string") {
    return res.status(400).json({ error: "Invalid Telegram ID" });
  }

  if (req.method === "PUT") {
    try {
      const { savedChatsIds } = req.body;

      // Validation
      if (!Array.isArray(savedChatsIds)) {
        return res.status(400).json({ error: "Invalid savedChatsIds format" });
      }

      // Update the user's saved chats in the database
      const updatedUser = await prisma.user.update({
        where: { telegramId },
        data: {
          savedChats: { set: savedChatsIds }
        }
      });
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating saved chats:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Reject any other HTTP methods
  return res.status(405).json({ error: "Method Not Allowed" });
}
