import axios from "axios";
import User from "../models/User.js";
import Module from "../models/Module.js";
import Content from "../models/Content.js";
import { env } from "../config/env.js";

const WHAPI_URL = process.env.WHAPI_URL || "https://gate.whapi.cloud/messages/text";
const WHAPI_TOKEN = env.WHAPI_TOKEN;
const PRICING_URL = "http://localhost:5173/pricing";

/**
 * UTILS & NORMALIZATION
 */
const normalizeText = (value = "") => String(value).toLowerCase().trim();

export const formatNumber = (from = "") => {
  return from.split("@")[0].replace(/\D/g, "");
};

/**
 * INTENT DETECTION (The "Intelligence" Layer)
 */
const intents = {
  isGreeting: (text) => /^(ai-academy|hello|hi|start|hey)$/i.test(text),
  isModules: (text) => /\b(modules|lessons|courses|study|list|show)\b/i.test(text),
  isPrice: (text) => /\b(price|cost|buy|pay|pricing|subscription)\b/i.test(text),
  isHelp: (text) => /\b(help|support|what can you do|menu)\b/i.test(text),
  // Extracts standalone numbers or "module 5"
  getModuleChoice: (text) => {
    const match = text.match(/\b(?:module\s+)?(\d+)\b/i);
    return match ? Number(match[1]) : null;
  }
};

/**
 * DATABASE LOGIC
 */
const findOrCreateUserByPhone = async (phoneNumber) => {
  if (!phoneNumber) return null;
  let user = await User.findOne({ phoneNumber });
  if (!user) {
    user = await User.create({ phoneNumber, role: "USER", lastInteraction: new Date() });
  }
  return user;
};

/**
 * REPLY BUILDERS
 */
const getModulesList = async () => {
  const modules = await Module.find().sort({ createdAt: 1 });
  if (!modules.length) return "📚 Our curriculum is being updated. Check back soon!";

  const list = modules.map((m, i) => `${i + 1}️⃣ *${m.title}* ${m.isFree ? "✅ (Free)" : "🔒 (Premium)"}`).join("\n");
  return `*Available Modules:*\n\n${list}\n\n_Reply with the number (e.g., "1") to open a module._`;
};

const getModuleContent = async (user, index) => {
  const modules = await Module.find().sort({ createdAt: 1 });
  const target = modules[index - 1];

  if (!target) return "❌ I couldn't find that module. Type *modules* to see the list.";

  if (!target.isFree && !user.hasPaid) {
    return `🔐 *${target.title}* is a Premium module.\n\nTo unlock our full catalog, visit:\n${PRICING_URL}`;
  }

  const contents = await Content.find({ moduleId: target._id }).sort({ createdAt: 1 });
  if (!contents.length) return `📂 *${target.title}* is currently empty.`;

  const items = contents.map((c, i) => `${i + 1}. ${c.title} [${c.type}]`).join("\n");
  return `📖 *${target.title}*\n\nContents:\n${items}\n\n_Enjoy your learning!_`;
};

/**
 * CORE LOGIC
 */
const detectReply = async (text, user) => {
  // 1. Mandatory Entry Point
  if (intents.isGreeting(text)) {
    return "Thank you for reaching out to the AI Academy! 🚀\n\nHow can I help you today?\n\n🔹 View *Modules*\n🔹 Check *Pricing*\n🔹 Get *Help*";
  }

  // 2. Module Navigation
  if (intents.isModules(text)) {
    return await getModulesList();
  }

  // 3. Pricing
  if (intents.isPrice(text)) {
    return `💰 *Pricing Information*\n\nWe offer a mix of free and premium AI content. You can upgrade your account here: ${PRICING_URL}`;
  }

  // 4. Contextual Selection (The "Smarter" bit)
  const choice = intents.getModuleChoice(text);
  if (choice) {
    return await getModuleContent(user, choice);
  }

  // 5. Fallback
  return "🤔 I didn't quite get that. \n\nType *modules* to see courses or *price* for info.";
};

/**
 * WHATSAPP DISPATCHER
 */
const sendWhatsAppText = async (to, body) => {
  if (!WHAPI_TOKEN) return console.error("Missing WHAPI_TOKEN");
  try {
    await axios.post(WHAPI_URL, { to, body }, {
      headers: { Authorization: `Bearer ${WHAPI_TOKEN}` }
    });
  } catch (err) {
    console.error("Whapi Error:", err.response?.data || err.message);
  }
};

export const processMessage = async ({ message, from }) => {
  try {
    const phoneNumber = formatNumber(from);
    const user = await findOrCreateUserByPhone(phoneNumber);
    const reply = await detectReply(normalizeText(message), user);

    await sendWhatsAppText(from, reply);
  } catch (error) {
    console.error("Critical System Error:", error);
  }
};
