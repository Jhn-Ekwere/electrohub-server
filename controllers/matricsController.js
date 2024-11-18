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

// graph data for the dashboard
// array of orders par month with date and total amount
const getOrdersPerMonth = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).sort({ dateOrdered: 1 });
  const ordersPerMonth = [];
  let currentMonth = 0;
  let currentYear = 0;
  let totalAmount = 0; 
  orders.forEach((order) => {
    const orderMonth = new Date(order.dateOrdered).getMonth();
    const orderYear = new Date(order.dateOrdered).getFullYear();
    if (currentMonth === orderMonth && currentYear === orderYear) {
      totalAmount += order.totalAmount;
    } else {
      if (currentMonth !== 0) {
        ordersPerMonth.push({ date: `${currentYear}-${currentMonth + 1}`, totalAmount });
      }
      currentMonth = orderMonth;
      currentYear = orderYear;
      totalAmount = order.totalAmount;
    }
  });
  res.status(200).send(ordersPerMonth);
}
);


//graph data for the dashboard
//array of orders par day with date and total amount
const getOrdersPerDay = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).sort({ dateOrdered: 1 });
  const ordersPerDay = [];
  let currentDay = 0;
  let currentMonth = 0;
  let currentYear = 0;
  let totalAmount = 0;
  orders.forEach((order) => {
    const orderDay = new Date(order.dateOrdered).getDate();
    const orderMonth = new Date(order.dateOrdered).getMonth();
    const orderYear = new Date(order.dateOrdered).getFullYear();
    if (currentDay === orderDay && currentMonth === orderMonth && currentYear === orderYear) {
      totalAmount += order.totalAmount;
    } else {
      if (currentDay !== 0) {
        ordersPerDay.push({ date: `${currentYear}-${currentMonth + 1}-${currentDay}`, totalAmount });
      }
      currentDay = orderDay;
      currentMonth = orderMonth;
      currentYear = orderYear;
      totalAmount = order.totalAmount;
    }
  });
  res.status(200).send(ordersPerDay);
}
);

//graph data for the dashboard
//array of registered users par day with date  and total registered users on that day
const getUsersPerDay = asyncHandler(async (req, res) => {
  const users = await User.find({}).sort({ createdAt: 1 });
  const usersPerDay = [];
  let currentDay = 0;
  let currentMonth = 0;
  let currentYear = 0;
  let totalUsers = 0;
  users.forEach((user) => {
    const userDay = new Date(user.createdAt).getDate();
    const userMonth = new Date(user.createdAt).getMonth();
    const userYear = new Date(user.createdAt).getFullYear();
    if (currentDay === userDay && currentMonth === userMonth && currentYear === userYear) {
      totalUsers += 1;
    } else {
      if (currentDay !== 0) {
        usersPerDay.push({ date: `${currentYear}-${currentMonth + 1}-${currentDay}`, totalUsers });
      }
      currentDay = userDay;
      currentMonth = userMonth;
      currentYear = userYear;
      totalUsers = 1;
    }
  });
  res.status(200).send(usersPerDay);
}
);

//graph data for the dashboard
//array of products created per day with date and total products created on that day
const getProductsPerDay = asyncHandler(async (req, res) => {
  const products = await product.find({}).sort({ createdAt: 1 });
  const productsPerDay = [];
  let currentDay = 0;
  let currentMonth = 0;
  let currentYear = 0;
  let totalProducts = 0;
  products.forEach((product) => {
    const productDay = new Date(product.createdAt).getDate();
    const productMonth = new Date(product.createdAt).getMonth();
    const productYear = new Date(product.createdAt).getFullYear();
    if (currentDay === productDay && currentMonth === productMonth && currentYear === productYear) {
      totalProducts += 1;
    } else {
      if (currentDay !== 0) {
        productsPerDay.push({ date: `${currentYear}-${currentMonth + 1}-${currentDay}`, totalProducts });
      }
      currentDay = productDay;
      currentMonth = productMonth;
      currentYear = productYear;
      totalProducts = 1;
    }
  });
  res.status(200).send(productsPerDay);
}
);



module.exports = { getMetrics, getOrdersPerMonth, getOrdersPerDay, getUsersPerDay, getProductsPerDay };
