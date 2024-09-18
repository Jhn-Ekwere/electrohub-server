const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const OrderItem = require("../models/orderItem");

//@desc Create a new order
//@route POST /orders
//@access Private
const createOrder = asyncHandler(async (req, res) => {
  const { user,
          products,
          totalAmount,
          shippingAddress1,
          shippingAddress2,
          city,
          zip,
          orderItems,
          status,
          country,
          phone, } = req.body;
  const orderItemsIds = Promise.all( orderItems.map(async (orderItem) => {
    let newOrderItem = new OrderItem({
      quantity: orderItem.quantity,
      product: orderItem.product
    });

    newOrderItem = await newOrderItem.save();
    return newOrderItem._id;
  }))
  const orderItemsIdsResolved = await orderItemsIds;
  
  const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId) => {
    const orderItem = await OrderItem.findById(orderItemId).populate("product", "totalAmount");
    const totalPrice = orderItem.product.price * orderItem.quantity;
    return totalPrice;
  }
  ));
  
  const totalPricesResolved = totalPrices.reduce((a, b) => a + b, 0);

  try {
    const newOrder = new Order({
      user,
      products,
      totalAmount: totalPrices,
      shippingAddress1,
      shippingAddress2,
      city,
      zip,
      country,
      phone,
      orderItems: totalPricesResolved,

      status, // Default order status (can be customized)
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
    const orders = await Order.find()
      .populate("user", "name")
      .populate("orderItems")
      .populate({ path: "orderItems", populate: "product" }); // Populate user and product details
    if (!orders) {
      return res.status(404).json({ message: "No orders found" });
    }
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
    const order = await Order.findById(id).populate("user").populate({path: "orderItems", populate: "product"});
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

  // Validate input data (optional)

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      req.body,
      { new: true } // To return the updated order
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//@desc Delete an order
//@route DELETE /orders/:id
//@access Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.orderItems.map(async orderItem => {
      await OrderItem.findById(orderItem._id);
      await orderItem.deleteOne();

    })
    await order.deleteOne();
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
