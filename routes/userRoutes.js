const express = require("express");
const router = express.Router();
const { getUsers, getMe, registerUser, updateUser, deleteUser, loginUser } = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/").get(protect, admin, getUsers);
router.route("/me").get(protect, getMe);
router.route("/update").put(protect, updateUser);
router.route("/delete/").delete(protect, admin, deleteUser);

module.exports = router;
