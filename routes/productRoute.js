const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const multipleUpload = require("../middleware/multipleUpload");
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getProducts,
  deleteProduct,
  updateProduct,
  createProduct,
  getProductById,
  likeProduct,
  reviewProduct,
} = require("../controllers/productController");

router.route("/").get(getProducts);
router.route("/like/:userId/:productId").put(protect, likeProduct);
router.route("/review/:userId/:productId").put(protect, reviewProduct);
router.route("/create").post(protect, admin, upload.array("images"), multipleUpload, createProduct);
router.route("/update/:id").put(protect, admin, upload.array("images"), updateProduct);
router.route("/delete/:id").delete(protect, admin, deleteProduct);
router.route("/:id").get(getProductById);

module.exports = router;
