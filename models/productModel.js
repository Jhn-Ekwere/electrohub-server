const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Name of the component (e.g., "100nF Capacitor")
    category: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }], // Category (e.g., "Capacitors", "ICs", "Transistors")
    subcategory: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" }], // Optional subcategory (e.g., "Electrolytic Capacitor")
    dataSheet: { type: String }, // URL or reference to the component's datasheet
    manufacturer: { type: String }, // Manufacturer of the component
    isFeatured: {
      type: Boolean,
      default: false,
    },
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
    discount: {
      type: Number, 
      default: 0,
      min: 0,
    },
    price: { type: Number, required: true }, // Price of the component
    numReviews: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    numLikes: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      required: false,
    },
    star: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
    isProductNew: {
      type: Boolean, 
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
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);


productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

productSchema.set("toJSON", {
  virtuals: true,
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
