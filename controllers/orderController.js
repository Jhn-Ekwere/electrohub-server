const asyncHandler = require("express-async-handler");

//@desc Create a new order
//@route POST /orders
//@access Private
const createOrder = asyncHandler(async (req, res) => {
  const { user, products, totalPrice, shippingAddress } = req.body;

  // Validate input data (optional)

  try {
    const newOrder = new Order({
      user,
      products,
      totalPrice,
      shippingAddress,
      status: "placed", // Default order status (can be customized)
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder); // Created status code
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//@desc Get all orders
//@route GET /orders
//@access Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find().populate("user").populate("products"); // Populate user and product details
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//@desc Get order by ID
//@route GET /orders/:id
//@access Private/Admin
const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id).populate("user").populate("products");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//@desc Update an order
//@route PUT /orders/:id
//@access Private/Admin
const updateOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { products, totalPrice, shippingAddress, status } = req.body;

  // Validate input data (optional)

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { products, totalPrice, shippingAddress, status },
      { new: true } // To return the updated order
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
};
