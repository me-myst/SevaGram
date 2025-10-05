const express = require("express");
const router = express.Router();
const {
  getAllServices,
  getServiceById,
  createService,
  deleteService,
} = require("../controllers/serviceController");
const { protect, authorize } = require("../middleware/auth");

router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.post("/", protect, authorize("admin"), createService);
router.delete("/:id", protect, authorize("admin"), deleteService);

module.exports = router;
