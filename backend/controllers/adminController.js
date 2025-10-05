const User = require("../models/User");
const Booking = require("../models/Booking");
const Service = require("../models/Service");

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort("-createdAt");

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("customerId", "name email phone")
      .populate("serviceId", "name category")
      .populate("providerId", "name phone")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Assign provider to booking
// @route   PUT /api/bookings/:id/assign
// @access  Private/Admin
exports.assignProvider = async (req, res) => {
  try {
    const { providerId } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.providerId = providerId;
    booking.status = "Confirmed";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Provider assigned successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
