import Module from "../models/Module.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

function addAccessFlags(modules, { isAdmin, hasPaid, purchasedIds }) {
  return modules.map((m) => {
    const moduleId = String(m._id);
    const isPaidModule = !m.isFree && Number(m.price || 0) > 0;
    const hasPurchased = purchasedIds.has(moduleId);
    const canAccess = !isPaidModule || isAdmin || hasPurchased || hasPaid;

    return {
      ...m,
      isPaidModule,
      hasPurchased,
      canAccess,
      isLocked: !canAccess,
      requiresPurchase: isPaidModule && !canAccess
    };
  });
}

async function buildAccessContext({ userId, role }) {
  const isAdmin = String(role || "").toUpperCase() === "ADMIN";
  if (isAdmin || !userId) {
    return {
      isAdmin,
      hasPaid: false,
      purchasedIds: new Set()
    };
  }

  const user = await User.findById(userId).select("hasPaid purchasedModules").lean();
  const purchasedIds = new Set((user?.purchasedModules || []).map((id) => String(id)));

  return {
    isAdmin,
    hasPaid: Boolean(user?.hasPaid),
    purchasedIds
  };
}

export async function createModule(payload) {
  const course = await Course.findById(payload.courseId);
  if (!course) throw new Error("Course not found");
  return Module.create(payload);
}

export async function getModulesByCourseId(courseId, accessContext = {}) {
  const modules = await Module.find({ courseId }).sort({ createdAt: 1 }).lean();
  const ctx = await buildAccessContext(accessContext);
  return addAccessFlags(modules, ctx);
}

export async function getAllModules(accessContext = {}) {
  const modules = await Module.find().sort({ createdAt: -1 }).lean();
  const ctx = await buildAccessContext(accessContext);
  return addAccessFlags(modules, ctx);
}

export async function purchaseModule({ userId, moduleId }) {
  const moduleDoc = await Module.findById(moduleId);
  if (!moduleDoc) throw new Error("Module not found");

  if (moduleDoc.isFree || Number(moduleDoc.price || 0) <= 0) {
    return {
      alreadyAccessible: true,
      message: "This module is free and already accessible"
    };
  }

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const hasModule = (user.purchasedModules || []).some(
    (id) => String(id) === String(moduleDoc._id)
  );

  if (!hasModule) {
    user.purchasedModules = [...(user.purchasedModules || []), moduleDoc._id];
  }

  user.hasPaid = true;
  await user.save();

  return {
    alreadyAccessible: hasModule,
    message: hasModule ? "Module already purchased" : "Module purchased successfully",
    moduleId: moduleDoc._id,
    price: moduleDoc.price
  };
}
