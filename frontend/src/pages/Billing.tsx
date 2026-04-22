import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Loader2, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  ChevronLeft,
  CreditCard,
  AlertCircle,
  Check,
  Sparkles,
  Brain,
  Zap
} from "lucide-react";

// Use the exact color from your sidebar: #0A5E53
const BRAND_COLOR = "#0A5E53";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const API_BASE = "http://localhost:5000";

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export const Billing = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const navigate = useNavigate();

  const startPayment = async () => {
    try {
      setLoading(true);
      setMessage(null);

      const sdkReady = await loadRazorpayScript();
      if (!sdkReady) {
        throw new Error("Failed to load Razorpay checkout SDK");
      }

      const orderRes = await fetch(`${API_BASE}/api/payments/create-order`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const orderJson = await orderRes.json();
      if (!orderRes.ok || !orderJson?.data) {
        throw new Error(orderJson?.message || "Unable to create payment order");
      }

      const order = orderJson.data;

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "AI Academy",
        description: "Unlock Premium AI Modules",
        order_id: order.orderId,
        theme: { color: BRAND_COLOR },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch(`${API_BASE}/api/payments/verify`, {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(response)
            });

            const verifyJson = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyJson?.message || "Payment verification failed");
            }

            setMessage({ type: 'success', text: "Payment successful! Premium modules unlocked." });
            setTimeout(() => navigate("/Course"), 2000);
          } catch (err: any) {
            setMessage({ type: 'error', text: err?.message || "Payment verification failed" });
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setMessage({ type: 'error', text: "Payment cancelled" });
          }
        }
      });

      razorpay.open();
    } catch (err: any) {
      setLoading(false);
      setMessage({ type: 'error', text: err?.message || "Payment failed" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A5E53] via-[#0D6B5F] to-[#0F7A6B] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Shapes */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-40 right-20 w-32 h-32 bg-emerald-300/20 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-20 left-1/4 w-24 h-24 bg-cyan-300/15 rounded-full blur-xl"
        />

        {/* Geometric Patterns */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-white/30 rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-emerald-200/50 rounded-full"></div>
        <div className="absolute bottom-1/3 left-1/5 w-3 h-3 bg-cyan-200/40 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-white/20 rounded-full"></div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Back Button - Important for UX */}
      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="fixed top-8 left-8 z-10 flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-medium bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm"
      >
        <ChevronLeft className="w-5 h-5" /> Back to Courses
      </motion.button>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl bg-white/95 backdrop-blur-xl rounded-[32px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden flex flex-col md:flex-row relative"
      >
        {/* Left Side: Order Summary (Enhanced Visual Design) */}
        <div className="md:w-5/12 bg-gradient-to-br from-[#0A5E53] via-[#0D6B5F] to-[#0F7A6B] p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-300/10 rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight">AI Academy</span>
                <div className="w-8 h-1 bg-emerald-300/60 rounded-full mt-1"></div>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold mb-8 leading-tight bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
              Unlock Premium AI Mastery
            </h2>
            <div className="space-y-5">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-sm font-semibold">Advanced LLM Concepts</span>
                  <p className="text-xs text-white/70">Deep dive into language models</p>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-sm font-semibold">Agentic AI Integration</span>
                  <p className="text-xs text-white/70">Build autonomous AI systems</p>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-sm font-semibold">Professional Certificate</span>
                  <p className="text-xs text-white/70">Industry-recognized certification</p>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/20 relative z-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <p className="text-white/60 text-xs uppercase font-bold tracking-widest mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                Total Amount
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">₹499</span>
                <div className="flex flex-col">
                  <span className="text-white/40 text-sm">one-time</span>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-emerald-300 text-xs font-medium">Limited Time</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Payment Action (Enhanced Design) */}
        <div className="md:w-7/12 p-10 bg-gradient-to-br from-white via-gray-50/50 to-emerald-50/30 flex flex-col justify-center relative">
          {/* Decorative Elements */}
          <div className="absolute top-10 right-10 w-16 h-16 bg-gradient-to-br from-emerald-200/30 to-cyan-200/30 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 left-10 w-12 h-12 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-lg"></div>

          <div className="relative z-10">
            <div className="mb-10 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold mb-4"
              >
                <ShieldCheck className="w-4 h-4" />
                Secure Checkout
              </motion.div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">Complete Your Purchase</h3>
              <p className="text-gray-600 text-sm">Join thousands of AI professionals worldwide</p>
            </div>

          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-cyan-50 to-blue-50 border border-emerald-200/50 flex items-center justify-between shadow-lg shadow-emerald-100/50"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-lg">Bank-grade Security</p>
                  <p className="text-sm text-gray-600">256-bit SSL encryption • PCI DSS compliant</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-emerald-600 mb-1">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-sm font-bold">Verified</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500">Active Protection</span>
                </div>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -12px rgba(10, 94, 83, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              onClick={startPayment}
              disabled={loading}
              className="w-full py-6 rounded-3xl bg-gradient-to-r from-[#0A5E53] via-[#0D6B5F] to-[#0F7A6B] hover:from-[#094E45] hover:via-[#0B5F53] hover:to-[#0E6E61] text-white font-bold text-xl shadow-2xl shadow-[#0A5E53]/30 flex items-center justify-center gap-3 group transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden"
            >
              {/* Button Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin relative z-10" />
                  <span className="relative z-10">Processing Payment...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-6 h-6 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                  <span className="relative z-10">Pay with Razorpay</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
                </>
              )}
            </motion.button>

            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-xl border flex items-center gap-3 ${
                    message.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  {message.type === 'success' ? (
                    <Check className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <p className="text-sm font-medium">{message.text}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col items-center gap-6 pt-6">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2 text-gray-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-medium">PCI DSS Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-medium">Instant Activation</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6 grayscale opacity-60">
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" className="h-5" alt="Razorpay" />
                <div className="w-px h-4 bg-gray-300"></div>
                <span className="text-xs text-gray-500 font-medium">Secured by Razorpay</span>
              </div>
              
              <div className="flex items-center gap-4 text-center">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-600 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full border-2 border-white flex items-center justify-center text-white text-[8px] font-bold">+</div>
                </div>
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">
                  Trusted by 10,000+ Students
                </p>
              </div>
            </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 max-w-sm mx-4"
            >
              <div className="w-16 h-16 bg-[#0A5E53] rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-gray-900 mb-2">Processing Payment</h3>
                <p className="text-sm text-gray-500">Please wait while we secure your transaction...</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};