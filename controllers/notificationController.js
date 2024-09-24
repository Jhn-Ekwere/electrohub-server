const asyncHandler = require("express-async-handler");
const Notification = require("../models/notificationModel");

// @desc    Create a new notification
// @route   POST /api/notifications
// @access  Private
const createNotification = asyncHandler(async (req, res) => {
  const { recipient, title, message, orderId, shortId } = req.body;

  const notification = new Notification({
    recipient,
    title,
    message,
    orderId,
    shortId,
  });

  const newNotification = await notification.save();
  res.status(201).json(newNotification);
});

// @desc    Get notifications for a user
// @route   GET /api/notifications/:userId
// @access  Private
const getNotificationsForUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const notifications = await Notification.find({ recipient: userId })
    .sort({ createdAt: -1 })
    .populate("recipient", "name email");

  res.json(notifications);
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:notificationId/read
// @access  Private
const markNotificationAsRead = asyncHandler(async (req, res) => {
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
const deleteNotification = asyncHandler(async (req, res) => {
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
