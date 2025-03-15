import { NextApiRequest, NextApiResponse } from "next";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const MINI_APP_URL = process.env.MINI_APP_URL;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const body = req.body;

  if (!body || !body.message) {
    return res.status(400).json({ error: "Invalid request" });
  }

  const chatId = body.message.chat.id;
  const messageText = body.message.text;

  if (messageText === "/start") {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: "Open the Mini App:",
        reply_markup: {
          inline_keyboard: [[{ text: "Open App", url: MINI_APP_URL }]],
        },
      }),
    });

    return res.status(200).json({ message: "Sent mini app button" });
  }

  return res.status(200).json({ message: "No action taken" });
}