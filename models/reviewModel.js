const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Reference to the user who wrote the review
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  rating: { type: Number, required: true, min: 1, max: 5 }, // Rating (e.g., star rating)
  comment: {
    type: String,
    required: true,
  }, // Textual content of the review
  createdAt: { type: Date, default: Date.now }, // Timestamp of the review creation
});

reviewSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

reviewSchema.set("toJSON", {
  virtuals: true,
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
