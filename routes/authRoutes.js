const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  getMe,
  registerUser,
  updateUser,
  deleteUser,
  loginUser,
  toggleRole,
  changePassword,
  forgotPassword,
  resetPassword,
  addProductsToCart,
} = require("../controllers/authController");
const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/").get(getUsers);
router.route("/me").get(protect, getMe);
router.route("/:id").get(getUserById);
router.route("/:id/toggle-role").put(protect, admin, toggleRole);
router.route("/:id").put(upload.array("image"), updateUser);
router.route("/:id").delete(deleteUser);
router.route("/:id/change-password").put(changePassword);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:resetToken").post(resetPassword);
router.route("/carts/:userId/products").post(protect, addProductsToCart);

module.exports = router;
