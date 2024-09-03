const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { json } = require("express");
const User = require("../models/userModel");


const protect = asyncHandler(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
  const accessToken = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
 
  // get user info from the token
  userInfo = await User.findById(decoded.id).select("-password");

  req.user = userInfo;
  next();

  if(!accessToken){
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401), json({ message: "Not authorized as an admin" });
    throw new Error("Not authorized as an admin");
  }
};

module.exports = { protect, admin,   };
