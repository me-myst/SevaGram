const mongoose = require("mongoose");

const serviceProviderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  serviceCategory: [
    {
      type: String,
      required: true,
      enum: [
        "Plumbing",
        "Electrical",
        "Carpentry",
        "Agriculture Equipment",
        "Appliance Repair",
        "Pest Control",
        "Cleaning",
        "Painting",
        "Water Pump Service",
        "Solar Panel Maintenance",
        "Other",
      ],
    },
  ],
  experience: {
    type: Number,
    required: [true, "Please provide years of experience"],
    min: 0,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  skills: [String],
  servingAreas: [
    {
      village: String,
      district: String,
      state: String,
    },
  ],
  availability: {
    type: String,
    enum: ["Available", "Busy", "Unavailable"],
    default: "Available",
  },
  documents: {
    idProof: String,
    certification: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  completedJobs: {
    type: Number,
    default: 0,
  },
  priceRange: {
    min: Number,
    max: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ServiceProvider", serviceProviderSchema);
