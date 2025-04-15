/**
 * API route for fetching or creating a user
 * 
 * This endpoint retrieves a user by their Telegram ID or creates a new user
 * if one doesn't exist. It's used for user initialization and data retrieval.
 */

import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * GET /api/user/[telegramId]/user
 * 
 * Fetches a user by Telegram ID or creates a new user if not found
 * 
 * @param {NextApiRequest} req - The request object containing telegramId in query
 * @param {NextApiResponse} res - The response object
 * @returns {Promise<void>} - Returns the user object with status 200 if found or 201 if created
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { telegramId } = req.query;

  // Validation
  if (typeof telegramId !== "string") {
    return res.status(400).json({ error: "Invalid Telegram ID" });
  }

  const user = await prisma.user.findFirst({ where: { telegramId } });

  // If user doesn't exist, create a new one with default settings
  if (!user) {
    const newUser = await prisma.user.create({
      data: {
        telegramId,
        theme: 'light',  // Default theme
        language: 'en',  // Default language (English)
      },
    });
    return res.status(201).json(newUser);
  }

  res.status(200).json(user);
}
