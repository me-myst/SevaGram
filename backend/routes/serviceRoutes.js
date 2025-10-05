const express = require("express");
const router = express.Router();
const {
  getAllServices,
  getService,
  getServicesByCategory,
  createService,
} = require("../controllers/serviceController");
const { protect, authorize } = require("../middleware/auth");

router.get("/", getAllServices);
router.get("/:id", getService);
router.get("/category/:category", getServicesByCategory);
router.post("/", protect, authorize("admin"), createService);

module.exports = router;
