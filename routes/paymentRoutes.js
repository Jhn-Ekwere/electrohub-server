const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createPayment,
  updatePaymentStatus,
  getPaymentById,
  getPaymentsForUser,
  deletePayment,
} = require("../controllers/paymentController");

router.route("/").post( createPayment).get( getPaymentsForUser);
router.route("/:id").get( getPaymentById).put( updatePaymentStatus).delete( deletePayment);

module.exports = router;
