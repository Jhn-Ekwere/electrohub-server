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

// @desc     Delete a product
// @route    DELETE /api/products/:id
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

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
