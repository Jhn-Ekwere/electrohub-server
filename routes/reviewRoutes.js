const express = require("express");
const router = express.Router();
const { createReview, getReviewsForProduct, deleteReview } = require("../controllers/reviewsController");

// Create a new review
router.route("/").post(createReview);

// Get all reviews for a product
router.route("/:productId").get(getReviewsForProduct);

// Delete a review
router.route("/:id").delete(deleteReview);

module.exports = router;
