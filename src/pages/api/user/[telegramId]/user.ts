import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { telegramId } = req.query;

  if (typeof telegramId !== "string") {
    return res.status(400).json({ error: "Invalid Telegram ID" });
  }

  const user = await prisma.user.findFirst({ where: { telegramId } });

  if (!user) {
    const newUser = await prisma.user.create({
      data: {
        telegramId,
        theme: 'light',
        language: 'en',
      },
    });
    return res.status(201).json(newUser);
  }

  res.status(200).json(user);
}