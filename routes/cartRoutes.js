const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  addToCart,
  updateCartItem,
  getCartForUser,
  removeItemFromCart,
  clearCart,
} = require("../controllers/cartController");

router.route("/").post(protect, addToCart).get(protect, getCartForUser);
router.route("/update/:id").put(protect, updateCartItem);
router.route("/remove/:id").delete(protect, removeItemFromCart);
router.route("/clear").delete(protect, clearCart);

module.exports = router;
