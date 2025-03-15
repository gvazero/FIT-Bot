import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") return res.status(405).json({ error: "Method Not Allowed" });

  const { telegramId } = req.query;
  const { theme } = req.body;

  if (typeof telegramId !== "string" || !["light", "dark"].includes(theme)) {
    return res.status(400).json({ error: "Invalid data" });
  }

  const updatedUser = await prisma.user.update({
    where: { telegramId: telegramId },
    data: { theme: theme },
  });

  res.status(200).json(updatedUser);
}
