const asyncHandler = require("express-async-handler");
const Address = require("../models/addressModel");
const User = require("../models/userModel");

// @desc    Add a new address
// @route   POST /api/addresses
// @access  Private
addAddress = asyncHandler(async (req, res) => {
  const { street, city, state, country, postalCode, user } = req.body;

  const address = new Address({
    street,
    city,
    state,
    country,
    postalCode,
  });

  const createdAddress = await address.save();
  await User.findByIdAndUpdate(user, { $push: { address: createdAddress._id } });
  res.status(201).json(createdAddress);
});

// @desc    Update an address
// @route   PUT /api/addresses/:id
// @access  Private
updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }

  const updatedAddress = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedAddress);
});

// @desc    Delete an address
// @route   DELETE /api/addresses/:id
// @access  Private
deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }

  await address.deleteOne();
  res.json({ message: "Address removed" });
});

// @desc    Get all addresses for a user
// @route   GET /api/addresses/user/:userId
// @access  Private
getUserAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.params.userId });
  res.json(addresses);
});

module.exports = { addAddress, updateAddress, deleteAddress, getUserAddresses };
