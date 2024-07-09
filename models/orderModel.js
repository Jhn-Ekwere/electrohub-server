const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the user who placed the order
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // Array of ordered products (references to Product table)
  totalAmount: { type: Number, required: true },
  shippingAddress: { type: String }, // Shipping address
  status: { type: String, required: true }, // Order status (e.g., "placed", "shipped", "delivered")
  // ... other order details like payment information
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
