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
  }, // Reference to the reviewed product
  rating: { type: Number, required: true, min: 1, max: 5 }, // Rating (e.g., star rating)
  comment: {
    type: String,
    required: true,
  }, // Textual content of the review
  createdAt: { type: Date, default: Date.now }, // Timestamp of the review creation
});

const Review = mongoose.model("review", reviewSchema);
module.exports = Review;
