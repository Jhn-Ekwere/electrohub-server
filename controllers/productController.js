const Product = require("../models/productModel");
const Like = require("../models/likesModel");
const User = require("../models/userModel");
const cloudinary = require("../utils/cloudinary");
const asyncHandler = require("express-async-handler");

// @desc     Get single product
// @route    GET /api/products/:id
// @access   Public
const getProducts = asyncHandler(async (req, res) => {
  const product = await Product.find()
    .populate("reviews", "-__v -createdAt")
    .populate("category", "-__v -createdAt")
    .populate("subcategory", "-__v -createdAt")
    .populate("likes", "-__v -createdAt")
    .populate({ path: "reviews", populate: { path: "user", select: "name id " } });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});

// @desc     Get single product
// @route    GET /api/products/:id
// @access   Public
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id)
    .populate("reviews", "-__v -createdAt")
    .populate("category", "-__v -createdAt")
    .populate("subcategory", "-__v -createdAt")
    .populate("likes", "-__v -createdAt");
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

// @desc     Create a product
// @route    POST /api/products
// @access   Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const images = req.images;
  const {
    name,
    price,
    discount,
    description,
    star,
    likes,
    isProductNew,
    reviews,
    inStock,
    category,
    quantity,
    subcategory,
    dataSheet,
    manufacturer,
    isFeatured,
  } = req.body;

  if (!images) {
    res.status(400);
    throw new Error("No image uploaded");
  } else {
    const product = new Product({
      name,
      category,
      subcategory,
      dataSheet,
      manufacturer,
      images,
      discount,
      price,
      numReviews: reviews?.length, // Assuming `reviews` is an array of ObjectId references
      description,
      star,
      likes,
      isProductNew,
      reviews,
      inStock,
      isFeatured,
      quantity,
    });

    const createdProduct = await product.save();
    res.status(200).json(createdProduct);
  }
});

// @desc     Update a product
// @route    PUT /api/products/:id
// @access   Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const newImages = req.files;
  const imageUrls = [];
  const {
    name,
    price,
    discount,
    description,
    inStock,
    category,
    quantity,
    subcategory,
    dataSheet,
    manufacturer,
    numReviews,
    star,
    likes,
    isProductNew,
    isFeatured,
  } = req.body;

  const product = await Product.findById(req.params.id);
  if (product) {
    const data = {
      name,
      price,
      discount,
      description,
      inStock,
      category,
      quantity,
      subcategory,
      dataSheet,
      manufacturer,
      numReviews,
      star,
      likes,
      isProductNew,
      isFeatured,
    };

    if (newImages && newImages?.length > 0) {
      // delete images
      const imageIds = product.images;
      const deletionResults = await Promise.all(
        imageIds.map((imageId) => cloudinary.uploader.destroy(imageId.public_id))
      );

      const successfulDeletions = deletionResults.filter((result) => result.result === "ok");
      const failedDeletions = deletionResults.filter((result) => result.result !== "ok");
      if (successfulDeletions.length > 0) {
        console.log("Successfully deleted", successfulDeletions.length, "images");
      } else {
        console.error("No images were deleted");
      }

      if (failedDeletions.length > 0) {
        console.error("Failed to delete some images:", failedDeletions);
        // You may consider logging specific error messages for debugging
      }

      // image url from cloudinary

      for (const image of newImages) {
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
      data.images = imageUrls;
    }

    const updatedProduct = await product.updateOne(data);
    res.status(200).json({ messages: "Product updated successfully", updatedProduct });
  } else {
    res.status(404).json({ message: "Product not found" });
    throw new Error("Product not found");
  }
});

// @desc     Like a product
// @route    PUT /api/like/:userId/:productId
// @access   Private
const likeProduct = asyncHandler(async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const like = new Like({
      user: userId,
      product: productId,
    });
    await like.save();

    await Product.findByIdAndUpdate(productId, {
      $push: { likes: like._id },
    });
    await User.findByIdAndUpdate(productId, {
      $push: { likes: like._id },
    });

    res.status(201)._construct(like);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc     Unlike a product
// @route    DELETE /api/unlike/:userId/:productId
// @access   Private
const UnLikeProduct = asyncHandler(async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const like = await Like.findOneAndDelete({ user: userId, product: productId });

    if (!like) {
      return res.status(400).json({ message: "You have not liked this product" });
    }

    await Product.findByIdAndUpdate(productId, {
      $pull: { likes: like._id },
    });
    await User.findByIdAndUpdate(productId, {
      $pull: { likes: like._id },
    });

    res.status(201).json({ message: "Product unliked" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc    Review a product
// @route   PUT /api/products/review/:userId/:productId
// @access  private/Admin
const reviewProduct = asyncHandler(async (req, res) => {
  const { productId, userId } = req.params;
  const { rating, comment } = req.body;

  const product = await Product.findById(productId);

  if (product) {
    const alreadyReviewed = product.reviews.find((review) => review.userId.toString() === userId.toString());

    if (alreadyReviewed) {
      res.status(400).json("Product already reviewed by this user");
      throw new Error("Product already reviewed by this user");
    }

    console.log(productId);
    const review = {
      product: productId, // Assuming the user's name is attached to the request object
      rating: Number(rating),
      comment,
      user: userId,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.star = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404).json("Product not found");
    throw new Error("Product not found");
  }
});

// @desc     Delete a product
// @route    DELETE /api/products/delete/:id
// @access   Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    const imageIds = product.images;
    const deletionResults = await Promise.all(
      imageIds.map((imageId) => cloudinary.uploader.destroy(imageId.public_id))
    );

    const successfulDeletions = deletionResults.filter((result) => result.result === "ok");
    const failedDeletions = deletionResults.filter((result) => result.result !== "ok");

    // delete product
    const deletedProduct = await product.deleteOne();

    if (deletedProduct && successfulDeletions.length > 0) {
      console.log("Successfully deleted", successfulDeletions.length, "images");
      res.status(200).json({ message: "Product deleted successfully" });
    } else {
      console.error("No images were deleted");
      res.status(400).json({ message: "Failed to delete any images" });
    }

    if (failedDeletions.length > 0) {
      console.error("Failed to delete some images:", failedDeletions);
      // You may consider logging specific error messages for debugging
    }
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  likeProduct,
  UnLikeProduct,
  reviewProduct,
};
