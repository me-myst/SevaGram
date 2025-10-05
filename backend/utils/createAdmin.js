require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@sevagram.com" });

    if (existingAdmin) {
      console.log("❌ Admin already exists!");
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: "Admin User",
      email: "admin@sevagram.com",
      password: "admin123", // Change this to a secure password
      phone: "1234567890",
      role: "admin",
      address: {
        village: "Admin Village",
        district: "Admin District",
        state: "Admin State",
        pincode: "000000",
      },
    });

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: admin@sevagram.com");
    console.log("🔑 Password: admin123");
    console.log("⚠️  Please change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
