const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },

  profilePic: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },

  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
  phoneNumber: { type: String, required: false },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
  dateOfBirth: { type: Date },
  profilePicture: { type: String }, // URL to the image
  role: { type: String, default: "user", enum: ["user", "admin", "marchant"] }, // User roles
  wishlist: { type: mongoose.Schema.Types.ObjectId, ref: "Wishlist" }, // Array of product IDs
  cart: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  }],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});



const User = mongoose.model("User", userSchema);

module.exports = User;
