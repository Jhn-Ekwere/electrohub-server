const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createNotification,
  getNotificationsForUser,
  markNotificationAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

router.route("/").post(createNotification)
router.route("/:userId").get(getNotificationsForUser);
  
router.route("/mark/:id").put( markNotificationAsRead);
router.route("/:id").delete( deleteNotification);

module.exports = router;
