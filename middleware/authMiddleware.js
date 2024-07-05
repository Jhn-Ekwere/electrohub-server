const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { json } = require("express");
const { auth } = require("express-oauth2-jwt-bearer");
const { default: axios } = require("axios");

const jwtCheck = auth({
  audience: "http://localhost:8000",
  issuerBaseURL: "https://electrohub.us.auth0.com/",
  tokenSigningAlg: "RS256",
});

const protect = asyncHandler(async (req, res, next) => {
  const accessToken = req.headers.authorization.split(" ")[1];
  const response = await axios.get("https://electrohub.us.auth0.com/userinfo", {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
  const userInfo = response.data;
  req.user = userInfo;
  next();
});

// const protect = asyncHandler(async (req, res, next) => {
//   let token;
//   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//     try {
//       // Get token from header
//       token = req.headers.authorization.split(" ")[1];
//       // Verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       // Find user by id
//       req.user = await User.findById(decoded.id).select("-password");
//       next();
//     } catch (error) {
//       console.error(error);
//       res.status(401).json({ message: "Not authorized, token failed" });
//       throw new Error("Not authorized, token failed");
//     }
//   }

//   if (!token) {
//     res.status(401).json({ message: "Not authorized, no token" });
//     throw new Error("Not authorized, no token");
//   }
// });

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401), json({ message: "Not authorized as an admin" });
    throw new Error("Not authorized as an admin");
  }
};
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated) {
    next();
  } else {
    res.status(401), json({ message: "User is not authenticated" });
    throw new Error("User is not authenticated");
  }
};

module.exports = { protect, admin, isAuthenticated, jwtCheck };
