import { getProfileService } from "../services/profile.service.js";

export const getProfileController = async (req, res) => {
  try {
    const userId = req.user.userId;

    const data = await getProfileService(userId);

    res.status(200).json({
      message: "Profile fetched",
      data
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};
