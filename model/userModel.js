const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
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
    dateOfBirth: { type: Date },
    profilePicture: { type: String }, // URL to the image
    role: { type: String, default: "user", enum: ["user", "admin", "marchant"] }, // User roles
    wishlist: { type: mongoose.Schema.Types.ObjectId, ref: "Wishlist" }, // Array of product IDs
    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// userSchema.virtual(id).get(function () {
//   return this._id.toHexString();
// });

// userSchema.set("toJSON", {
//   virtuals: true,
// });

const User = mongoose.model("User", userSchema);

module.exports = User;
