import axios from "axios";
import User from "../models/User.js";
import Module from "../models/Module.js";
import Content from "../models/Content.js";
import { env } from "../config/env.js";

const WHAPI_URL = process.env.WHAPI_URL || "https://gate.whapi.cloud/messages/text";
const WHAPI_TOKEN =env.WHAPI_TOKEN;

const PRICING_URL = "http://localhost:5173/pricing";

const normalizeText = (value = "") => String(value).toLowerCase().trim().replace(/\s+/g, " ");

export const formatNumber = (from = "") => {
  const base = String(from).split("@")[0];
  const digits = base.replace(/\D/g, "");
  return digits || base;
};

const isModulesIntent = (text) =>
  /\b(modules|show modules|list modules|all modules)\b/i.test(text);

const isPriceIntent = (text) => /\b(price|cost|pricing)\b/i.test(text);

const getRequestedModuleNumber = (text) => {
  const match = text.match(/\b(?:open\s+)?module\s+(\d+)\b/i);
  return match ? Number(match[1]) : null;
};

const findOrCreateUserByPhone = async (phoneNumber) => {
  if (!phoneNumber) return null;

  let user = await User.findOne({
    $or: [{ phoneNumber }, { phoneNumber: `+${phoneNumber}` }]
  });

  if (user) return user;

  try {
    user = await User.create({ phoneNumber, role: "USER" });
    return user;
  } catch {
    return User.findOne({
      $or: [{ phoneNumber }, { phoneNumber: `+${phoneNumber}` }]
    });
  }
};

const getAllModulesOrdered = async () => {
  return Module.find().sort({ createdAt: 1 }).select("title isFree");
};

const buildModulesListReply = async () => {
  const modules = await getAllModulesOrdered();
  if (!modules.length) return "No modules are available right now.";

  const lines = modules.map(
    (m, idx) => `${idx + 1}. ${m.title} (${m.isFree ? "Free" : "Paid"})`
  );
  return `Modules:\n${lines.join("\n")}`;
};

const buildPriceReply = async () => {
  const paidCount = await Module.countDocuments({ isFree: false });
  if (!paidCount) return "All modules are currently free.";
  return `Paid modules require purchase.\nVisit: ${PRICING_URL}`;
};

const buildModuleAccessReply = async ({ user, moduleNumber }) => {
  const modules = await getAllModulesOrdered();

  if (!modules.length) return "No modules are available right now.";
  if (!moduleNumber || moduleNumber < 1 || moduleNumber > modules.length) {
    return `Invalid module number. Send "modules" to view available modules.`;
  }

  const targetModule = modules[moduleNumber - 1];
  const hasAccess = targetModule.isFree || Boolean(user?.hasPaid);

  if (!hasAccess) {
    return `Please purchase access here: ${PRICING_URL}`;
  }

  const contentList = await Content.find({ moduleId: targetModule._id })
    .sort({ createdAt: 1 })
    .select("title type");

  if (!contentList.length) {
    return `Module ${moduleNumber}: ${targetModule.title}\nNo content uploaded yet.`;
  }

  const lines = contentList.map((c, idx) => `${idx + 1}. ${c.title} [${c.type}]`);
  return `Module ${moduleNumber}: ${targetModule.title}\nContent:\n${lines.join("\n")}`;
};

const detectReply = async ({ message, user }) => {
  const text = normalizeText(message);

  if (!text) return "I can help with courses, modules, and pricing.";
  if (text.includes("ai-academy")) return "Welcome to AI Academy 🚀 How can I help you?";

  if (isModulesIntent(text)) return buildModulesListReply();
  if (isPriceIntent(text)) return buildPriceReply();

  const moduleNumber = getRequestedModuleNumber(text);
  if (moduleNumber) {
    return buildModuleAccessReply({ user, moduleNumber });
  }

  return "I can help with courses, modules, and pricing.";
};

const sendWhatsAppText = async ({ to, body }) => {
  if (!WHAPI_TOKEN) return;
  await axios.post(
    WHAPI_URL,
    { to, body },
    {
      headers: {
        Authorization: `Bearer ${WHAPI_TOKEN}`,
        "Content-Type": "application/json"
      },
      timeout: 15000
    }
  );
};

export const processMessage = async ({ message, from }) => {
  try {
    if (!message || !from) return;

    const phoneNumber = formatNumber(from);
    const user = await findOrCreateUserByPhone(phoneNumber);
    const reply = await detectReply({ message, user });

    await sendWhatsAppText({ to: from, body: reply });
  } catch (error) {
    await sendWhatsAppText({
      to: from,
      body: "Something went wrong. Please try again."
    }).catch(() => {});
    console.error("processMessage error:", error?.message || error);
  }
};