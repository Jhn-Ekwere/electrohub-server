const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    name: String,
    comment: String,
    rating: Number,
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
    description: {
      type: String,
      required: false,
    },
    star: Number,
    liked: {
      type: [String],
      required: true,
    },
    isProductNew: Boolean,
    reviews: [reviewSchema],
    inStock: Boolean,
    category: [String],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;