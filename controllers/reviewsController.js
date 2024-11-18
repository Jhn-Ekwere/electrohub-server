const asyncHandler = require("express-async-handler");
const Review = require("../models/reviewModel");
const Product = require("../models/productModel");

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
createReview = asyncHandler(async (req, res) => {
  const { product, rating, comment, user } = req.body;

  const reviewedProduct = await Product.findById(product).populate("reviews");
  if (!reviewedProduct) {
    res.status(404);
    throw new Error("Product not found");
  }

  const alreadyReviewed = reviewedProduct.reviews.find((review) => review?.user?.toString() === user.toString());
  if (alreadyReviewed) {
    return res.status(400).json("Product already reviewed by this user");
  }

  const review = new Review({
    user,
    product,
    rating,
    comment,
  });

  // Save the review
  const createdReview = await review.save();

  // Update the product with the new review
  const updatedProduct = await Product.findByIdAndUpdate(
    product,
    { $push: { reviews: createdReview.id } },
    { new: true } // Return the updated document
  ).populate("reviews");

  // Calculate the updated star rating
  const updatedStarRating =
    updatedProduct.reviews.reduce((acc, review) => acc + review.rating, 0) / updatedProduct.reviews.length;

  // Update the product's star rating
  updatedProduct.star = updatedStarRating;
  updatedProduct.numReviews = updatedProduct.numReviews + 1;
  await updatedProduct.save();

  return res.status(201).json({ message: "Review added successfully", review: createdReview });
});

// @desc    Get all reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
getReviewsForProduct = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).populate("user");
  res.status(200).json(reviews);
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
deleteReview = asyncHandler(async (req, res) => {
  // get the review ID from the URL
  const reviewId = req.params.id;

  // Find the review by ID
  const review = await Review.findById(reviewId);
  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }
  // Find the product associated with the review
  const product = await Product.findById(review.product);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Delete the review
  await review.deleteOne();

  // Remove the review from the product's reviews array
  product.reviews = product.reviews.filter((r) => r.toString() !== reviewId);

  // Recalculate the star rating
  const updatedReviews = await Review.find({ id: { $in: product.reviews } });

  const calculatedStar = updatedReviews.length > 0 ? updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length : 0;
  product.star = Math.max(calculatedStar, 1);
  product.numReviews = product.numReviews - 1;

  // Save the updated product
  await product.save();

  res.status(200).json({ message: "Review deleted successfully" });
});

module.exports = {
  createReview,
  getReviewsForProduct,
  deleteReview,
};
