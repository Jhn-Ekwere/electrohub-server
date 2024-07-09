const asyncHandler = require("express-async-handler");
const Notification = require("../models/notificationModel"); 


// @desc    Create a new notification
// @route   POST /api/notifications
// @access  Private
createNotification = asyncHandler(async (req, res) => {
  const { recipient, title, message } = req.body;

  const notification = await Notification.create({
    recipient,
    title,
    message,
  });

  res.status(201).json(notification);
});

// @desc    Get notifications for a user
// @route   GET /api/notifications/:userId
// @access  Private
getNotificationsForUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const notifications = await Notification.find({ recipient: userId }).sort({ createdAt: -1 });

  res.json(notifications);
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:notificationId/read
// @access  Private
markNotificationAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  const notification = await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  res.json(notification);
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:notificationId
// @access  Private
deleteNotification = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  const notification = await Notification.findByIdAndDelete(notificationId);

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  res.json({ message: "Notification deleted successfully" });
});


module.exports = {
  createNotification,
  getNotificationsForUser,
  markNotificationAsRead,
  deleteNotification,
};