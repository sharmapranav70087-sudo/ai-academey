import {
  createModule,
  getModulesByCourseId,
  purchaseModule,
  getAllModules
} from "../services/module.service.js";

export async function createModuleController(req, res) {
  try {
    const moduleDoc = await createModule(req.body);
    return res.status(201).json({ ok: true, data: moduleDoc });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message });
  }
}

export async function getModulesByCourseController(req, res) {
  try {
    const modules = await getModulesByCourseId(req.params.courseId, {
      userId: req.user?.userId,
      role: req.user?.role
    });
    return res.status(200).json({ ok: true, data: modules });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message });
  }
}

export async function getAllModulesController(req, res) {
  try {
    const modules = await getAllModules({
      userId: req.user?.userId,
      role: req.user?.role
    });
    return res.status(200).json({ ok: true, data: modules });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
}

export async function purchaseModuleController(req, res) {
  try {
    const userId = req.user?.userId;
    const { moduleId } = req.params;

    const result = await purchaseModule({ userId, moduleId });
    return res.status(200).json({ ok: true, ...result });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message });
  }
}
