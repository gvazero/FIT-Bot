/**
 * API route for fetching all chats
 * 
 * This endpoint retrieves all chats from the database and returns them sorted by short_name.
 * It's used by the frontend to display the list of available chats.
 */

import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * GET /api/chats
 * 
 * Retrieves all chats from the database
 * 
 * @param {NextApiRequest} req - The request object
 * @param {NextApiResponse} res - The response object
 * @returns {Promise<void>} - Returns a JSON array of all chats
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Fetch all chats from the database, sorted by short_name
    const chats = await prisma.chat.findMany({
      orderBy: {
        short_name: 'asc',
      },
    });
    res.status(200).json(chats);

  } catch (error) {
    console.error("Error fetching saved chats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
