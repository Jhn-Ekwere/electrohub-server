const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the user who placed the order
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      required: true,
    },
  ], // Array of ordered items (references to orderItem table)

  shippingAddress1: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required:true }, // Shipping address1
  shippingAddress2: { type: mongoose.Schema.Types.ObjectId, ref: "Address" }, // Shipping address2
  city: { type: String, required: true }, // City
  zip: { type: String, required: true }, // Zip code
  country: { type: String, required: true }, // Country
  phone: { type: String, required: true }, // Phone number
  status: {
    type: String,
    required: true,
    default: "pending",
  }, // Order status (e.g., "placed", "shipped", "delivered")
  totalAmount: { type: Number, required: true },
  // ... other order details like payment information
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
