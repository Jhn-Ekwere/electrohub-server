const asyncHandler = require("express-async-handler");
const Payment = require("../models/paymentModel"); // Adjust the path as necessary

// @desc    Create a new payment
// @route   POST /api/payments
// @access  Private
createPayment = asyncHandler(async (req, res) => {
  const { amount, currency, paymentMethod, userId, orderId } = req.body;

  const payment = await Payment.create({
    amount,
    currency,
    paymentMethod,
    userId,
    orderId,
    status: "pending", // Default status
  });

  res.status(201).json(payment);
});

// @desc    Update payment status
// @route   PUT /api/payments/:paymentId/status
// @access  Private
updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  const { status } = req.body;

  const payment = await Payment.findByIdAndUpdate(paymentId, { status }, { new: true });

  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }

  res.json(payment);
});

// @desc    Get payment by ID
// @route   GET /api/payments/:paymentId
// @access  Private
getPaymentById = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  const payment = await Payment.findById(paymentId);

  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }

  res.json(payment);
});

// @desc    Get payments for a user
// @route   GET /api/payments/user/:userId
// @access  Private
getPaymentsForUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const payments = await Payment.find({ userId });

  res.json(payments);
});

// @desc    Delete payment
// @route   DELETE /api/payments/:paymentId
// @access  Private
deletePayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  const payment = await Payment.findByIdAndDelete(paymentId);

  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }

  res.json({ message: "Payment deleted successfully" });
});


module.exports = {
  createPayment,
  updatePaymentStatus,
  getPaymentById,
  getPaymentsForUser,
  deletePayment,
};