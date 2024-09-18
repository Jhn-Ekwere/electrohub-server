const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const cloudinary = require("../utils/cloudinary");
const Address = require("../models/addressModel");

//@desc     Create user
//@route    POST /api/users
//@access   Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstname, email, password, role } = req.body;
  if (!firstname || !email || !password) {
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
    firstname,
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
  const user = await User.findOne({ email }).populate("address", "-__v");
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
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        address: user.address,
        phone: user.phone,
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
    .populate("cart")
    .populate("address");
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
    firstname: user.firstname,
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
  const image = req.files[0];
  const {
    firstName,
    lastName,
    profilePicture,
    email,
    city,
    street,
    state,
    country,
    postalCode,
    phone,
    likes,
    dateOfBirth,
    wishlist,
    cart,
    role,

  } = req.body;

  const newAddress = new Address({
    street,
    city,
    state,
    country,
    postalCode,
  })
  
  const address = await newAddress.save();

  const user = await User.findById(req.params.id);

  let data = {
    firstName,
    lastName,
    profilePicture,
    firstName,
    email,
    address: address._id,
    phone,
    likes,
    dateOfBirth,
    wishlist,
    cart,
  };
  if (user.role === "admin") {
    data = {
      ...data,
      role,
    };
  }
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (image) {
    // delete images
    const deleteProfilePicture = async (user) => {
      const imageId = user.profilePicture;

      if (imageId) {
        try {
          // Await the result of the deletion promise
          const deletionResult = await cloudinary.uploader.destroy(imageId[0].public_id);

          // Check if the deletion was successful
          if (deletionResult.result === "ok") {
            console.log("Successfully deleted the image");
          } else {
            console.error("Failed to delete the image:", deletionResult);
          }
        } catch (error) {
          // Handle any errors that occur during deletion
          console.error("Error during image deletion:", error);
        }
      }
    };

    // Example usage of async function
    await deleteProfilePicture(user);
    // image url to cloudinary

    const result = await cloudinary.uploader.upload(image.path, {
      upload_preset: "onlineShop",
      resource_type: "auto",
    });
    const imageObject = {
      url: result.secure_url,
      public_id: result.public_id,
    };
    data.profilePicture = imageObject;
  }
  await user.updateOne(data);
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
