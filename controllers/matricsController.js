const product = require("../models/productModel");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

// POST /metrics - Create new metrics entry
const getMetrics = asyncHandler(async (req, res) => {
  try {
    // Execute all database queries in parallel
    const [productsTotal, ordersTotal, usersTotal, orders] = await Promise.all([
      product.find({}).countDocuments(),
      Order.find({}).countDocuments(),
      User.find({}).countDocuments(),
      Order.find({}),
    ]);

    // Calculate total income from all orders and round to two decimals
    const totalIncome = parseFloat(orders.reduce((acc, order) => acc + order.totalAmount, 0).toFixed(2));
    // Construct the metrics object
    const metrics = {
      totalIncome,
      totalOrders: ordersTotal,
      totalProducts: productsTotal,
      totalUsers: usersTotal,
    };

    // Send the metrics object as a response
    res.status(201).send(metrics);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = { getMetrics };
