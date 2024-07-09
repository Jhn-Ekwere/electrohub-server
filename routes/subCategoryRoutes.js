const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getSubCategories,
  getSubCategoryById,
} = require("../controllers/subCategoryController");

router.route("/").get(getSubCategories).post(addSubCategory);
router.route("/:id").get(getSubCategoryById).put(updateSubCategory).delete(deleteSubCategory);

module.exports = router;
