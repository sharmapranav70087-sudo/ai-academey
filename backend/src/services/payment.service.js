import crypto from "crypto";
import Razorpay from "razorpay";
import User from "../models/User.js";
import Module from "../models/Module.js";
import { env } from "../config/env.js";

const RAZORPAY_KEY_ID = env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = env.RAZORPAY_KEY_SECRET;

const SUBSCRIPTION_AMOUNT_INR = 499;

function getRazorpayClient() {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys are missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend .env");
  }

  return new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
  });
}

export async function createSubscriptionOrder({ userId }) {
  if (!userId) throw new Error("User not found");

  const razorpay = getRazorpayClient();
  const amountPaise = SUBSCRIPTION_AMOUNT_INR * 100;

  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt: `sub_${String(userId).slice(-8)}_${Date.now()}`,
    notes: {
      plan: "AI Academy Paid Modules",
      userId: String(userId)
    }
  });

  return {
    keyId: RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    orderId: order.id,
    planName: "AI Academy Paid Modules",
    displayAmountInr: SUBSCRIPTION_AMOUNT_INR
  };
}

export async function verifySubscriptionPayment({ userId, razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  if (!userId) throw new Error("User not found");
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new Error("Missing Razorpay payment fields");
  }
  if (!RAZORPAY_KEY_SECRET) throw new Error("Razorpay key secret missing");

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expected = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET).update(body).digest("hex");

  if (expected !== razorpay_signature) {
    throw new Error("Invalid payment signature");
  }

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const paidModules = await Module.find({ isFree: false, price: { $gt: 0 } }).select("_id").lean();
  const paidModuleIds = paidModules.map((m) => m._id);

  const existing = new Set((user.purchasedModules || []).map((id) => String(id)));
  for (const moduleId of paidModuleIds) {
    if (!existing.has(String(moduleId))) {
      user.purchasedModules.push(moduleId);
    }
  }

  user.hasPaid = true;
  await user.save();

  return {
    success: true,
    hasPaid: true,
    unlockedModules: paidModuleIds.length
  };
}
