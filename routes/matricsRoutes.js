const express = require("express");
const {
  getMetrics,
  getOrdersPerMonth,
  getOrdersPerDay,
  getUsersPerDay,
  getProductsPerDay,
} = require("../controllers/matricsController");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").get(protect, admin, getMetrics);
router.route("/orders-per-month").get(protect, admin, getOrdersPerMonth);
router.route("/orders-per-day").get(protect, admin, getOrdersPerDay);
router.route("/users-per-day").get(protect, admin, getUsersPerDay);
router.route("/products-per-day").get(protect, admin, getProductsPerDay);


module.exports = router;
