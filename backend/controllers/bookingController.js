const Booking = require("../models/Booking");

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const {
      serviceId,
      providerId,
      serviceCategory,
      scheduledDate,
      scheduledTime,
      address,
      problemDescription,
      estimatedPrice,
      paymentMethod,
    } = req.body;

    const booking = await Booking.create({
      customerId: req.user.id,
      serviceId,
      providerId,
      serviceCategory,
      scheduledDate,
      scheduledTime,
      address,
      problemDescription,
      estimatedPrice,
      paymentMethod,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Create Booking Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get my bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user.id })
      .populate("serviceId", "name category icon basePrice duration")
      .populate("providerId", "name phone email")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get My Bookings Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get provider bookings
// @route   GET /api/bookings/provider-bookings
// @access  Private/Provider
exports.getProviderBookings = async (req, res) => {
  try {
    // Find bookings assigned to this provider
    const bookings = await Booking.find({ providerId: req.user.id })
      .populate("customerId", "name email phone address")
      .populate("serviceId", "name category icon basePrice")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get Provider Bookings Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Provider
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = status;

    if (status === "Completed") {
      booking.completedAt = Date.now();
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    console.error("Update Booking Status Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
