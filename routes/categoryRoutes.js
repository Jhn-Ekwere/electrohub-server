const express = require("express");
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const router = express.Router();


// Define the route in your Express app
router.route("/").post(createCategory);

// Define the route in your Express app
router.route("/").get(getCategories);

// Define the route in your Express app
router.route("/:id").get(getCategoryById);

// Define the route in your Express app
router.route("/:id").put(updateCategory);

// Define the route in your Express app
router.route("/:id").delete(deleteCategory);

module.exports = router;
