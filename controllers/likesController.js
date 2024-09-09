const asyncHandler = require("express-async-handler");
const Like = require("../models/likesModel");
const Product = require("../models/productModel");

// @desc    Toggle a like on a product
// @route   POST /api/likes/:productId
// @access  Private
toggleLike = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const userId = req.params.userId;

  const existingLike = await Like.findOne({ user: userId, product: productId });

  let product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (existingLike) {
    // User already liked the product, remove the like
    await existingLike.deleteOne();
    // Remove like from product's likes array
    product.likes.pull(existingLike._id);
    product.numLikes = product.numLikes - 1;
    await product.save();
    res.status(200).json({ message: "Like removed" });
  } else {
    // User has not liked the product, add a new like
    const like = new Like({ user: userId, product: productId });
    await like.save();
    // Add like to product's likes array
    product.likes.push(like._id);
    // Example of updating the product review (increment numLikes)
    product.numLikes = product.numLikes + 1;
    await product.save();
    res.status(201).json({ message: "Like added and review updated" });
  }
});

module.exports = {
  toggleLike,
};
