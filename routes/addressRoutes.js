const express = require("express");
const router = express.Router();
const { addAddress, updateAddress, deleteAddress, getUserAddresses } = require("../controllers/addressController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(addAddress);
router.route("/:userId").get(getUserAddresses);
router.route("/:id").put(updateAddress).delete(deleteAddress);

module.exports = router;
