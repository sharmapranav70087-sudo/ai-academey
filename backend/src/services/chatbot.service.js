import axios from "axios";
import Module from "../models/Module.js";
import Content from "../models/Content.js";
import { env } from "../config/env.js";

const WHAPI_URL = process.env.WHAPI_URL || "https://gate.whapi.cloud/messages/text";
const WHAPI_TOKEN = env.WHAPI_TOKEN;
const PRICING_URL = "http://localhost:5173/pricing";

/**
 * 1. DYNAMIC CONTENT RETRIEVAL
 * This pulls the actual course list from your "Modules" collection.
 */
const fetchAcademyCatalog = async () => {
  const modules = await Module.find().sort({ createdAt: 1 });
  if (!modules.length) return "Our course catalog is currently being updated. Stay tuned! 🛠️";

  const list = modules.map((m, i) => {
    const status = m.isFree ? "🆓 *FREE*" : "💳 *PREMIUM*";
    return `${i + 1}️⃣ ${m.title.toUpperCase()}\n   └ Status: ${status}`;
  }).join("\n\n");

  return `*AI Academy Course Catalog* 🎓\n\n${list}\n\n_Send a number to see module contents!_`;
};

/**
 * 2. DYNAMIC PRICING RETRIEVAL
 * Calculates "Value" based on your actual database counts.
 */
const fetchPricingDetails = async () => {
  const totalModules = await Module.countDocuments();
  const paidModules = await Module.countDocuments({ isFree: false });

  return `💰 *Investment & Pricing*\n\n` +
         `• Total Courses: ${totalModules}\n` +
         `• Premium Tracks: ${paidModules}\n\n` +
         `Get full access to all premium tracks here:\n${PRICING_URL}`;
};

/**
 * 3. MODULE DRILL-DOWN
 * Fetches specific "Content" (videos/pdfs) inside a Module.
 */
const fetchModuleDetails = async (index) => {
  const modules = await Module.find().sort({ createdAt: 1 });
  const selected = modules[index - 1];

  if (!selected) return "❓ That module doesn't exist. Type *catalog* to see available numbers.";

  const content = await Content.find({ moduleId: selected._id });
  const contentList = content.length 
    ? content.map((c, i) => `   ${i + 1}. ${c.title} (${c.type})`).join("\n")
    : "   _No lessons uploaded yet._";

  return `📖 *Module:* ${selected.title}\n` +
         `*Type:* ${selected.isFree ? "Free Lesson" : "Premium Content"}\n\n` +
         `*Syllabus:*\n${contentList}\n\n` +
         `${!selected.isFree ? "⚠️ _Purchase required to view full lessons._" : ""}`;
};

/**
 * 4. THE INTELLIGENT ROUTER
 */
export const processMessage = async ({ message, from }) => {
  const input = message.toLowerCase().trim();
  let response = "";

  try {
    // TRIGGER: Entry Point
    if (input.includes("ai-academy")) {
      response = "Thank you for reaching out to the AI Academy! 🚀\n\nHow can I help you today?\n\n1️⃣ View *Catalog*\n2️⃣ Check *Pricing*\n3️⃣ Ask a *Question*";
    } 
    // TRIGGER: Catalog/Courses
    else if (input.match(/(catalog|course|module|list|show)/)) {
      response = await fetchAcademyCatalog();
    } 
    // TRIGGER: Pricing
    else if (input.match(/(price|cost|buy|pay|pricing)/)) {
      response = await fetchPricingDetails();
    } 
    // TRIGGER: Numbers (e.g. user types "1")
    else if (/^\d+$/.test(input)) {
      response = await fetchModuleDetails(parseInt(input));
    } 
    // FALLBACK
    else {
      response = "I'm the AI Academy Assistant. 🤖\n\nTry saying *'Catalog'* to see our courses or *'Pricing'* for details.";
    }

    // DISPATCH via Whapi
    await axios.post(WHAPI_URL, { to: from, body: response }, {
      headers: { Authorization: `Bearer ${WHAPI_TOKEN}` }
    });

  } catch (error) {
    console.error("Database Retrieval Error:", error.message);
  }
};
