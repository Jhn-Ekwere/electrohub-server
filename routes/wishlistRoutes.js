const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createWishlist,
  addProductToWishlist,
  removeProductFromWishlist,
  getUserWishlist,
  deleteWishlist,
} = require("../controllers/wishlistController");

router.route("/").post(protect, createWishlist).get(protect, getUserWishlist);
router.route("/add/:productId").put(protect, addProductToWishlist);
router.route("/remove/:productId").put(protect, removeProductFromWishlist);
router.route("/:id").delete(protect, deleteWishlist);

module.exports = router;
