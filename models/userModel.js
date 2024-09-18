const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
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
  address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
  phone: { type: String, required: false },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
  dateOfBirth: { type: Date },
  profilePicture: {
    type: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    required: true,
  }, // URL to the image
  role: { type: String, default: "user", enum: ["user", "admin", "marchant"] }, // User roles
  wishlist: { type: mongoose.Schema.Types.ObjectId, ref: "Wishlist" }, // Array of product IDs
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});


userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
