const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getAllBookings,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

router.get("/users", protect, authorize("admin"), getAllUsers);
router.get("/bookings", protect, authorize("admin"), getAllBookings);

module.exports = router;
