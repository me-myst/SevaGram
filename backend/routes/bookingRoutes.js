const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getProviderBookings,
  updateBookingStatus,
} = require("../controllers/bookingController");
const { assignProvider } = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

// Customer routes
router.post("/", protect, createBooking);
router.get("/my-bookings", protect, getMyBookings);

// Provider routes
router.get(
  "/provider-bookings",
  protect,
  authorize("provider"),
  getProviderBookings
);
router.put("/:id/status", protect, authorize("provider"), updateBookingStatus);

// Admin route - ADD THIS
router.put("/:id/assign", protect, authorize("admin"), assignProvider);

module.exports = router;
