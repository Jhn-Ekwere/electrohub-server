const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const loginSuccess = asyncHandler(async (req, res) => {
  const user = req.user; // Assuming "roles" is the claim name
  if (user) {
    // Check if user already exists
    const existingUser = await User.findOne({ email: user.email });

    if (existingUser) {
      // User already exists, handle the case (e.g., log them in)
      return res.send("User already exists!");
    }

    // Create a new user document
    const newUser = new User({
      email: user.email,
      name: user.name,
      profilePic: user.picture,
      // Add other user data if needed
    });

    // Save the new user to MongoDB
    await newUser.save();

    res.send("User created successfully!");
  } else {
    res.status(401).json({
      success: false,
      message: "User failed to log in",
    });
  }
});

//@desc     Create user
//@route    POST /api/users
//@access   Public
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, isAdmin } = req.body;
  if (!email || !password) {
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
    password: hashedPassword,
    isAdmin: isAdmin || false,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      email: user.email,
      isAdmin: user?.isAdmin,
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
        _id: user._id,
        email: user.email,
        isAdmin: user?.isAdmin,
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
    name,
    email,
    isAdmin,
  });
});

//@desc     Get single user
//@route    GET /api/users/:id
//@access   Public
const getMe = asyncHandler(async (req, res) => {
  const { _id, name, email, isAdmin } = await User.findById(req.user.id).select("-password");

  res.status(200).json({
    id: _id,
    name,
    email,
    isAdmin,
  });
});

//@desc     Update user
//@route    PUT /api/users/:id
//@access   Public
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  await user.updateOne(req.body);
  res.status(200).json({ message: `Updated user with id ${req.user.id}!` });
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
  res.status(200).json({ message: `Delete user with id ${req.params.id}!` });
});

// Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};

module.exports = { getUsers, getMe, registerUser, updateUser, deleteUser, loginUser, loginSuccess, getUserById };
