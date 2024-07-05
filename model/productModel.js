const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Name of the component (e.g., "100nF Capacitor")
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, // Category (e.g., "Capacitors", "ICs", "Transistors")
    subcategory: { type: String }, // Optional subcategory (e.g., "Electrolytic Capacitor")
    dataSheet: { type: String }, // URL or reference to the component's datasheet
    manufacturer: { type: String }, // Manufacturer of the component
    images: {
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
    },
    discount: Number,
    price: { type: Number, required: true }, // Price of the component
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
    isProductNew: {
      type: Boolean,
      required: true,
      default: true,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    inStock: {
      type: Boolean,
      required: true,
      default: true,
    },
    quantity: Number,
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
