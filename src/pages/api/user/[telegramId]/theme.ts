/**
 * API route for updating a user's theme preference
 * 
 * This endpoint allows updating the theme setting (light/dark) for a specific user
 * identified by their Telegram ID.
 */

import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * PUT /api/user/[telegramId]/theme
 * 
 * Updates a user's theme preference
 * 
 * @param {NextApiRequest} req - The request object containing telegramId in query and theme in body
 * @param {NextApiResponse} res - The response object
 * @returns {Promise<void>} - Returns the updated user object
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") return res.status(405).json({ error: "Method Not Allowed" });

  const { telegramId } = req.query;
  const { theme } = req.body;

  // Validation
  if (typeof telegramId !== "string" || !["light", "dark"].includes(theme)) {
    return res.status(400).json({ error: "Invalid data" });
  }

  // Update the user's theme preference in the database
  const updatedUser = await prisma.user.update({
    where: { telegramId: telegramId },
    data: { theme: theme },
  });

  res.status(200).json(updatedUser);
}
