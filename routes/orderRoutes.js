const express = require("express");
const router = express.Router();
const { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder } = require("../controllers/orderController");

// Define the route in your Express app
router.route("/").post(createOrder);

// Define the route in your Express app
router.route("/").get(getAllOrders);

// Define the route in your Express app
router.route("/:id").get(getOrderById);

// Define the route in your Express app
router.route("/:id").put(updateOrder);

// Define the route in your Express app
router.route("/:id").delete(deleteOrder);



module.exports = router;
