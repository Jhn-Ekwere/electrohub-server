function errorMiddleware(err, req, res, next) {
  // Log the error
  const statusCode = res.statusCode ? res.statusCode : 500;
  console.log(err);

  // Check if the error is a jwt error
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }

  // Check if the error is a mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((val) => val.message);
    const message = `Invalid data. ${errors.join(". ")}`;
    return res.json({ message });
  }

  // Set the response status code
  res.status(statusCode);

  // Send the error message as the response
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
  next();
}

module.exports = { errorMiddleware };
