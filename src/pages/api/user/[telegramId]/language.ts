/**
 * API route for updating a user's language preference
 * 
 * This endpoint allows updating the language setting for a specific user
 * identified by their Telegram ID.
 */

import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * PUT /api/user/[telegramId]/language
 * 
 * Updates a user's language preference
 * 
 * @param {NextApiRequest} req - The request object containing telegramId in query and language in body
 * @param {NextApiResponse} res - The response object
 * @returns {Promise<void>} - Returns the updated user object
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") return res.status(405).json({ error: "Method Not Allowed" });

  const { telegramId } = req.query;
  const { language } = req.body;

  // Validation
  if (typeof telegramId !== "string" || !["en", "ru", "uk", "kz", "cz"].includes(language)) {
    return res.status(400).json({ error: "Invalid data" });
  }

  // Update the user's language preference in the database
  const updatedUser = await prisma.user.update({
    where: { telegramId: telegramId },
    data: { language: language },
  });

  res.status(200).json(updatedUser);
}
