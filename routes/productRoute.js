const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const multipleUpload = require("../middleware/multipleUpload");
const { jwtCheck, admin } = require("../middleware/authMiddleware");
const {
  getProducts,
  deleteProduct,
  updateProduct,
  createProduct,
  getProductById,
  likeProduct,
  reviewProduct,
  UnLikeProduct,
} = require("../controllers/productController");

router.route("/").get(getProducts);
router.route("/like/:userId/:productId").put(jwtCheck, likeProduct);
router.route("/unlike/:userId/:productId").put(jwtCheck, UnLikeProduct);
router.route("/review/:userId/:productId").put(jwtCheck, reviewProduct);
router.route("/").post( upload.array("images"), multipleUpload, createProduct);
router.route("/:id").put( upload.array("images"), updateProduct);
router.route("/delete/:id").delete(jwtCheck, admin, deleteProduct);
router.route("/:id").get(getProductById);

module.exports = router;
