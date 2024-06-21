const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    name: String,
    comment: String,
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    userId: String,
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
    },
    images: {
      type: [String],
      required: true,
    },
    price: Number,
    discount: Number,
    numReviews: Number,
    description: {
      type: String,
      required: false,
    },
    star: Number,
    liked: {
      type: [String],
      required: true,
    },
    isProductNew: { type: Boolean, required: true },
    reviews: [reviewSchema],
    inStock: { type: Boolean, required: true },
    category: [String],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
