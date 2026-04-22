import {
  createSubscriptionOrder,
  verifySubscriptionPayment
} from "../services/payment.service.js";

export async function createSubscriptionOrderController(req, res) {
  try {
    const userId = req.user?.userId;
    const order = await createSubscriptionOrder({ userId });
    return res.status(200).json({ ok: true, data: order });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message });
  }
}

export async function verifySubscriptionPaymentController(req, res) {
  try {
    const userId = req.user?.userId;
    const result = await verifySubscriptionPayment({
      userId,
      razorpay_order_id: req.body?.razorpay_order_id,
      razorpay_payment_id: req.body?.razorpay_payment_id,
      razorpay_signature: req.body?.razorpay_signature
    });

    return res.status(200).json({ ok: true, message: "Payment verified", data: result });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message });
  }
}
