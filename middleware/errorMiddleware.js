function errorMiddleware(err, req, res, next) {
    // Log the error
    const statusCode = res.statusCode? res.statusCode : 500;

    // Set the response status code
    res.status(statusCode);

    // Send the error message as the response
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
}

module.exports = {errorMiddleware};