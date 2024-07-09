const express = require("express");
const router = express.Router();
const {  toggleLike,  } = require("../controllers/likesController");


router.route("/:productId/:userId").post(toggleLike)

module.exports = router;