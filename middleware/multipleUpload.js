const asyncHandler = require("express-async-handler");
 const cloudinary = require("../utils/cloudinary");



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
      const imageObject = {
        url: result.secure_url,
        public_id: result.public_id,
      };
      
      imageUrls.push(imageObject);
    }

    req.images = imageUrls;
  }
  next();
});

module.exports = UploadMultiple;
