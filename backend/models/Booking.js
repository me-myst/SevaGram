const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceProvider",
    required: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  serviceCategory: {
    type: String,
    required: true,
  },
  scheduledDate: {
    type: Date,
    required: [true, "Please provide scheduled date"],
  },
  scheduledTime: {
    type: String,
    required: [true, "Please provide scheduled time"],
  },
  address: {
    village: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: String,
  },
  problemDescription: {
    type: String,
    required: [true, "Please describe the problem"],
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"],
    default: "Pending",
  },
  estimatedPrice: {
    type: Number,
    required: true,
  },
  finalPrice: {
    type: Number,
  },
  paymentMethod: {
    type: String,
    enum: ["Cash", "UPI", "Card", "Wallet"],
    default: "Cash",
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Refunded"],
    default: "Pending",
  },
  cancellationReason: String,
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
