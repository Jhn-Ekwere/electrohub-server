const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  message: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

notificationSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

notificationSchema.set("toJSON", {
  virtuals: true,
});

const Notification = mongoose.model("Notification", notificationSchema);
