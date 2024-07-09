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
  loginSuccess,
} = require("../controllers/authController");
const { protect, admin, jwtCheck } = require("../middleware/authMiddleware");

router.route("/login").post(loginUser);
router.route("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in faliure",
  });
});
router.route("/register").post(registerUser);
router.route("/").get(jwtCheck, protect, getUsers);
router.route("/me").get(jwtCheck, protect, getMe);
router.route("/:id").get(getUserById);
router.route("/").put(jwtCheck, protect, updateUser);
router.route("/:id").delete(jwtCheck, protect, deleteUser);

router.route("/login/success").get(jwtCheck, protect, loginSuccess);

module.exports = router;
