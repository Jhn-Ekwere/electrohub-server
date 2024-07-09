const asyncHandler = require("express-async-handler");
const SubCategory = require("../models/subCategoryModel");

// @desc    Add a new subcategory
// @route   POST /api/subcategories
// @access  Private
addSubCategory = asyncHandler(async (req, res) => {
  const { name, description, category } = req.body;

  const subCategory = new SubCategory({
    name,
    description,
    category,
  });

  const createdSubCategory = await subCategory.save();
  res.status(201).json(createdSubCategory);
});

// @desc    Update a subcategory
// @route   PUT /api/subcategories/:id
// @access  Private
updateSubCategory = asyncHandler(async (req, res) => {
  const subCategory = await SubCategory.findById(req.params.id);

  if (!subCategory) {
    res.status(404);
    throw new Error("Subcategory not found");
  }

  const updatedSubCategory = await SubCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedSubCategory);
});

// @desc    Delete a subcategory
// @route   DELETE /api/subcategories/:id
// @access  Private
deleteSubCategory = asyncHandler(async (req, res) => {
  const subCategory = await SubCategory.findById(req.params.id);

  if (!subCategory) {
    res.status(404);
    throw new Error("Subcategory not found");
  }

  await subCategory.deleteOne();
  res.json({ message: "Subcategory removed" });
});

// @desc    Get all subcategories
// @route   GET /api/subcategories
// @access  Public
getSubCategories = asyncHandler(async (req, res) => {
  const subCategories = await SubCategory.find({}).populate("category", "name description _id");
  res.json(subCategories);
});

// @desc    Get a single subcategory by ID
// @route   GET /api/subcategories/:id
// @access  Public
getSubCategoryById = asyncHandler(async (req, res) => {
  const subCategory = await SubCategory.findById(req.params.id).populate("category", "name description _id");

  if (!subCategory) {
    res.status(404);
    throw new Error("Subcategory not found");
  }

  res.json(subCategory);
});


module.exports = {
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getSubCategories,
  getSubCategoryById,
};