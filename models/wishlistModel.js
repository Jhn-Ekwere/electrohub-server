const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

wishlistSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

wishlistSchema.set("toJSON", {
  virtuals: true,
});


const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;