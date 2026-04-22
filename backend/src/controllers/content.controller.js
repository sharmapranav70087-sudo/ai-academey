import { createContent, getContentsByModuleId } from "../services/content.service.js";

export async function createContentController(req, res) {
  try {
    const content = await createContent(req.body);
    return res.status(201).json({ ok: true, data: content });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message });
  }
}

export async function getContentsByModuleController(req, res) {
  try {
    const contents = await getContentsByModuleId({
      moduleId: req.params.moduleId,
      userId: req.user?.userId,
      role: req.user?.role
    });
    return res.status(200).json({ ok: true, data: contents });
  } catch (error) {
    if (String(error.message || "").includes("Purchase required")) {
      return res.status(403).json({ ok: false, message: error.message });
    }
    return res.status(400).json({ ok: false, message: error.message });
  }
}
