import { getDashboardService } from "../services/dashboard.service.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    const data = await getDashboardService({ userId });

    res.json({
      message: "Dashboard fetched",
      data
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};