import { processMessage } from "../services/chatbot.service.js";
export const webhookController = (req, res) => {
  console.log("🔥 WEBHOOK HIT");

  const msg = req.body?.messages?.[0];

  const message = msg?.text?.body;
  const from = msg?.from;
  const fromMe = msg?.from_me;

  console.log("from_me:", fromMe);

  res.sendStatus(200);

  // ❌ Ignore self messages
  if (fromMe) {
    console.log("⛔ Ignoring own message");
    return;
  }

  setImmediate(async () => {
    try {
      await processMessage({ message, from });
    } catch (err) {
      console.error("❌ webhook error:", err.message);
    }
  });
};