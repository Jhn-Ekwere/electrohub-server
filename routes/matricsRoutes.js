const express = require("express");
const { getMetrics } = require("../controllers/matricsController");
const { protect, admin,  } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").get( protect, admin, getMetrics);

module.exports = router;
