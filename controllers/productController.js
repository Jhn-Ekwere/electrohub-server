const Product = require("../model/productModal");

//@desc     Get all products
//@route    GET /api/products
//@access   Public
const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

// @desc     Get single product
// @route    GET /api/products/:id
// @access   Public
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
};

// @desc     Create a product
// @route    POST /api/products
// @access   Private/Admin
const createProduct = async (req, res) => {
  const images = req.images;
  const { title, price, discount, description, star, liked, isProductNew, reviews, inStock, category } = req.body;
  if (!images) {
    res.status(400);
    throw new Error("No image uploaded");
  } else {
    const product = new Product({
      title,
      images,
      price,
      discount,
      description,
      star,
      liked,
      isProductNew,
      reviews,
      inStock,
      category,
    });
    const createdProduct = await product.save();
    res.status(200).json(createdProduct);
  }
};

// @desc     Update a product
// @route    PUT /api/products/:id
// @access   Private/Admin
const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    const updatedProduct = await product.updateOne(req.body);
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: "Product not found" });
    throw new Error("Product not found");
  }
};

// @desc     Like a product
// @route    PUT /api/like/:userId/:productId
// @access   Private
const likeProduct = async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (product) {
    if (product.liked.includes(req.params.userId)) {
      product.liked = product.liked.filter((id) => id !== req.params.userId);
    } else {
      product.liked.push(req.params.userId);
    }
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
};

// @desc    Review a product
// @route   PUT /api/products/review/:userId/:productId
// @access  private/Admin
const reviewProduct = async (req, res) => {
  const { productId, userId } = req.params;
  const { rating, comment } = req.body;

  const product = await Product.findById(productId);

  if (product) {
    const alreadyReviewed = product.reviews.find((review) => review.userId.toString() === userId.toString());

    if (alreadyReviewed) {
      res.status(400).json("Product already reviewed by this user");
      throw new Error("Product already reviewed by this user");
    }

    const review = {
      name: req.user.name, // Assuming the user's name is attached to the request object
      rating: Number(rating),
      comment,
      userId,
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
};

// @desc     Delete a product
// @route    DELETE /api/products/delete/:id
// @access   Private/Admin
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  likeProduct,
  reviewProduct,
};
