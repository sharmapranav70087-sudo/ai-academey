import Content from "../models/Content.js";
import Module from "../models/Module.js";
import User from "../models/User.js";

export async function createContent(payload) {
  const moduleDoc = await Module.findById(payload.moduleId);
  if (!moduleDoc) throw new Error("Module not found");
  return Content.create(payload);
}

export async function getContentsByModuleId({ moduleId, userId, role }) {
  const moduleDoc = await Module.findById(moduleId).select("isFree price");
  if (!moduleDoc) throw new Error("Module not found");

  const isAdmin = String(role || "").toUpperCase() === "ADMIN";
  const needsPurchase = !moduleDoc.isFree && Number(moduleDoc.price || 0) > 0;

  if (needsPurchase && !isAdmin) {
    const user = await User.findById(userId).select("hasPaid purchasedModules");
    if (!user) throw new Error("User not found");

    const hasModule = (user.purchasedModules || []).some(
      (id) => String(id) === String(moduleDoc._id)
    );

    if (!hasModule && !user.hasPaid) {
      throw new Error("Purchase required to access this module");
    }
  }

  return Content.find({ moduleId }).sort({ createdAt: 1 });
}
