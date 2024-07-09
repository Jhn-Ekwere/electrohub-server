const asyncHandler = require("express-async-handler");
const Wishlist = require("../models/wishlistModel"); // Adjust the path as necessary

// @desc    Create a new wishlist
// @route   POST /api/wishlists
// @access  Private
createWishlist = asyncHandler(async (req, res) => {
  const { user } = req.body;

  const wishlistExists = await Wishlist.findOne({ user });

  if (wishlistExists) {
    res.status(400);
    throw new Error("Wishlist already exists for this user");
  }

  const wishlist = await Wishlist.create({
    user,
    products: [],
  });

  res.status(201).json(wishlist);
});

// @desc    Add product to wishlist
// @route   PUT /api/wishlists/:userId/add
// @access  Private
addProductToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const { userId } = req.params;

  const wishlist = await Wishlist.findOneAndUpdate(
    { user: userId },
    { $addToSet: { products: productId } }, // Prevents duplicate entries
    { new: true }
  );

  if (!wishlist) {
    res.status(404);
    throw new Error("Wishlist not found");
  }

  res.json(wishlist);
});

// @desc    Remove product from wishlist
// @route   PUT /api/wishlists/:userId/remove
// @access  Private
removeProductFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const { userId } = req.params;

  const wishlist = await Wishlist.findOneAndUpdate({ user: userId }, { $pull: { products: productId } }, { new: true });

  if (!wishlist) {
    res.status(404);
    throw new Error("Wishlist not found");
  }

  res.json(wishlist);
});

// @desc    Get user wishlist
// @route   GET /api/wishlists/:userId
// @access  Private
getUserWishlist = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const wishlist = await Wishlist.findOne({ user: userId }).populate("products");

  if (!wishlist) {
    res.status(404);
    throw new Error("Wishlist not found");
  }

  res.json(wishlist);
});

// @desc    Delete wishlist
// @route   DELETE /api/wishlists/:userId
// @access  Private
deleteWishlist = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const wishlist = await Wishlist.findOneAndDelete({ user: userId });

  if (!wishlist) {
    res.status(404);
    throw new Error("Wishlist not found");
  }

  res.json({ message: "Wishlist deleted successfully" });
});


module.exports = {
  createWishlist,
  addProductToWishlist,
  removeProductFromWishlist,
  getUserWishlist,
  deleteWishlist,
};