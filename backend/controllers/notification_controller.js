import Notifications from "../models/notification_model.js";
export const getNotifications = async (req, res) => {
    try {
      const userId = req.user._id;
      console.log("Fetching notifications for user ID: ", userId);
  
      const notifications = await Notifications.find({ to: userId }).populate({
        path: "from",
        select: "username profileImg",
      });
      console.log("Notifications found: ", notifications);
  
      await Notifications.updateMany({ to: userId }, { read: true });
  
      res.status(200).json(notifications);
    } catch (error) {
      console.log("Error in getNotification controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };

export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notifications.deleteMany({ to: userId });
    res.status(200).json({ message: "Notification delete successfully" });
  } catch (error) {
    console.log("Error in deleteNotifications controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
