const Cart = require("../models/cartModel");
const asyncHandler = require("express-async-handler");

// Add to Cart
addToCart = asyncHandler(async (req, res) => {
  const { userId, productId, quantity } = req.body;

  let cart = await Cart.findOne({ userId });

  if (cart) {
    // Check if product exists in cart
    const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId);

    if (productIndex > -1) {
      // Product exists, update quantity
      cart.products[productIndex].quantity += quantity;
    } else {
      // Add new product to cart
      cart.products.push({ productId, quantity });
    }
    cart = await cart.save();
  } else {
    // Create new cart for user
    cart = await Cart.create({
      userId,
      products: [{ productId, quantity }],
    });
  }

  res.status(201).json(cart);
});

// Update Cart Item
updateCartItem = asyncHandler(async (req, res) => {
  const { userId, productId, quantity } = req.body;

  const cart = await Cart.findOneAndUpdate(
    { userId, "products.productId": productId },
    { $set: { "products.$.quantity": quantity } },
    { new: true }
  );

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  res.json(cart);
});

// Get Cart for User
getCartForUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const cart = await Cart.findOne({ userId }).populate("products.productId");

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  res.json(cart);
});

// Remove Item from Cart
removeItemFromCart = asyncHandler(async (req, res) => {
  const { userId, productId } = req.body;

  const cart = await Cart.findOneAndUpdate({ userId }, { $pull: { products: { productId } } }, { new: true });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  res.json(cart);
});

// Clear Cart
clearCart = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const cart = await Cart.findOneAndUpdate({ userId }, { $set: { products: [] } }, { new: true });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  res.json(cart);
});

module.exports = { addToCart, updateCartItem, getCartForUser, removeItemFromCart, clearCart };
