const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

//@desc     Create user
//@route    POST /api/users
//@access   Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // check if user exsits
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json("User already exists");
    throw new Error("User already exists");
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create user
  const user = await User.create({
    email,
    name,
    password: hashedPassword,
    role: role || "user",
  });

  if (user) {
    res.status(201).json({
      id: user._id,
      email: user.email,
      role: user?.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//@desc     Login user
//@route    POST /api/users/login
//@access   Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // check if user exsits
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("Invalid credentials");
  } else {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.status(200).json({
        role: user.role,
        profilePicture: user.profilePicture,
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        phoneNumber: user.phoneNumber,
        likes: user.likes,
        dateOfBirth: user.dateOfBirth,
        wishlist: user.wishlist,
        cart: user.cart,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid credentials");
    }
  }
});

//@desc     Get all users
//@route    GET /api/users
//@access   Public
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select("-password")
    .populate("address", "-__v")
    .populate("likes")
    .populate("wishlist")
    .populate("cart");
  res.status(200).json(users);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json(user);

  res.status(200).json({
    id: _id,
    name: user.name,
    email: user.email,
  });
});

//@desc     Get single user
//@route    GET /api/users/:id
//@access   Public
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password -createdAt -__v");

  res.status(200).json(user);
});

//@desc     Update user
//@route    PUT /api/users/:id
//@access   Public
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  await user.updateOne(req.body);
  res.status(200).json({ message: `Updated user with id ${req.params.id}!` });
});

//@desc     Delete user
//@route    DELETE /api/users/:id
//@access   Public
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  await user.deleteOne();
  res.status(200).json({ message: `Deleted user with id ${req.params.id}!` });
});

// Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = { getUsers, getMe, registerUser, updateUser, deleteUser, loginUser, getUserById };
