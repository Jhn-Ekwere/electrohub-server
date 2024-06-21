const cloudinary = require("cloudinary").v2;
const asyncHandler = require("express-async-handler");

cloudinary.config({
  cloud_name: process.env.APP_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.APP_CLOUDINARY_API_KEY,
  api_secret: process.env.APP_CLOUDINARY_SECRET,
});

const UploadMultiple = asyncHandler(async (req, res, next) => {
  const images = req.files;
  const imageUrls = [];
  if (!images) {
    res.status(400);
    throw new Error("No image uploaded");
  } else {
    for (const image of images) {
      const result = await cloudinary.uploader.upload(image.path, {
        upload_preset: "onlineShop",
        resource_type: "auto",
      });
      imageUrls.push(result.secure_url);
    }

    req.images = imageUrls;
  }
  next();
});

module.exports = UploadMultiple;
