import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
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
