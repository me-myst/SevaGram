const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide service name"],
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Please provide service category"],
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
  description: {
    type: String,
    required: [true, "Please provide service description"],
  },
  icon: {
    type: String,
    default: "default-service-icon.png",
  },
  basePrice: {
    type: Number,
    required: [true, "Please provide base price"],
  },
  duration: {
    type: String, // e.g., "1-2 hours"
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Service", serviceSchema);
