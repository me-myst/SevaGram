const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Service = require("../models/Service");

// Load environment variables
dotenv.config();

const services = [
  // Plumbing Services
  {
    name: "Pipe Leak Repair",
    category: "Plumbing",
    description:
      "Fix leaking pipes and faucets in your home. Fast and reliable service.",
    icon: "🔧",
    basePrice: 150,
    duration: "1-2 hours",
    isActive: true,
  },
  {
    name: "Drain Cleaning",
    category: "Plumbing",
    description: "Clear clogged drains and sewage lines efficiently.",
    icon: "🚰",
    basePrice: 200,
    duration: "1-2 hours",
    isActive: true,
  },
  {
    name: "Water Tank Installation",
    category: "Plumbing",
    description: "Install new water tanks with proper connections.",
    icon: "🛁",
    basePrice: 500,
    duration: "3-4 hours",
    isActive: true,
  },

  // Electrical Services
  {
    name: "House Wiring",
    category: "Electrical",
    description: "Complete electrical wiring for homes and buildings.",
    icon: "⚡",
    basePrice: 300,
    duration: "4-6 hours",
    isActive: true,
  },
  {
    name: "Fan Installation",
    category: "Electrical",
    description: "Install ceiling fans and exhaust fans professionally.",
    icon: "🌀",
    basePrice: 100,
    duration: "1 hour",
    isActive: true,
  },
  {
    name: "Circuit Board Repair",
    category: "Electrical",
    description: "Fix electrical circuit boards and fuse boxes.",
    icon: "🔌",
    basePrice: 250,
    duration: "2-3 hours",
    isActive: true,
  },

  // Carpentry Services
  {
    name: "Furniture Repair",
    category: "Carpentry",
    description: "Repair and restore wooden furniture.",
    icon: "🪚",
    basePrice: 200,
    duration: "2-3 hours",
    isActive: true,
  },
  {
    name: "Door Installation",
    category: "Carpentry",
    description: "Install new doors and fix door frames.",
    icon: "🚪",
    basePrice: 400,
    duration: "3-4 hours",
    isActive: true,
  },
  {
    name: "Custom Cabinet Making",
    category: "Carpentry",
    description: "Design and build custom wooden cabinets.",
    icon: "🗄️",
    basePrice: 800,
    duration: "1-2 days",
    isActive: true,
  },

  // Agriculture Equipment
  {
    name: "Tractor Repair",
    category: "Agriculture Equipment",
    description: "Repair and maintain agricultural tractors.",
    icon: "🚜",
    basePrice: 500,
    duration: "3-5 hours",
    isActive: true,
  },
  {
    name: "Water Pump Service",
    category: "Agriculture Equipment",
    description: "Service and repair agricultural water pumps.",
    icon: "💧",
    basePrice: 300,
    duration: "2-3 hours",
    isActive: true,
  },
  {
    name: "Harvester Maintenance",
    category: "Agriculture Equipment",
    description: "Complete maintenance of harvesting equipment.",
    icon: "🌾",
    basePrice: 600,
    duration: "4-6 hours",
    isActive: true,
  },

  // Appliance Repair
  {
    name: "Washing Machine Repair",
    category: "Appliance Repair",
    description: "Fix all types of washing machine issues.",
    icon: "🧺",
    basePrice: 250,
    duration: "1-2 hours",
    isActive: true,
  },
  {
    name: "Refrigerator Repair",
    category: "Appliance Repair",
    description: "Repair refrigerators and cooling issues.",
    icon: "🧊",
    basePrice: 300,
    duration: "2-3 hours",
    isActive: true,
  },
  {
    name: "TV Repair",
    category: "Appliance Repair",
    description: "Fix LED, LCD, and smart TV problems.",
    icon: "📺",
    basePrice: 200,
    duration: "1-2 hours",
    isActive: true,
  },

  // Pest Control
  {
    name: "Termite Control",
    category: "Pest Control",
    description: "Complete termite treatment for homes.",
    icon: "🐜",
    basePrice: 400,
    duration: "3-4 hours",
    isActive: true,
  },
  {
    name: "Rodent Control",
    category: "Pest Control",
    description: "Get rid of rats and mice from your property.",
    icon: "🐭",
    basePrice: 300,
    duration: "2-3 hours",
    isActive: true,
  },
  {
    name: "Mosquito Fogging",
    category: "Pest Control",
    description: "Mosquito control and fogging service.",
    icon: "🦟",
    basePrice: 200,
    duration: "1-2 hours",
    isActive: true,
  },

  // Cleaning Services
  {
    name: "House Deep Cleaning",
    category: "Cleaning",
    description: "Complete deep cleaning of your entire house.",
    icon: "🧹",
    basePrice: 500,
    duration: "4-6 hours",
    isActive: true,
  },
  {
    name: "Kitchen Cleaning",
    category: "Cleaning",
    description: "Thorough cleaning of kitchen and appliances.",
    icon: "🧽",
    basePrice: 250,
    duration: "2-3 hours",
    isActive: true,
  },
  {
    name: "Bathroom Cleaning",
    category: "Cleaning",
    description: "Deep cleaning and sanitization of bathrooms.",
    icon: "🚿",
    basePrice: 150,
    duration: "1-2 hours",
    isActive: true,
  },

  // Painting Services
  {
    name: "Interior Painting",
    category: "Painting",
    description: "Professional interior wall painting services.",
    icon: "🎨",
    basePrice: 800,
    duration: "2-3 days",
    isActive: true,
  },
  {
    name: "Exterior Painting",
    category: "Painting",
    description: "Exterior wall painting with weather-resistant paint.",
    icon: "🖌️",
    basePrice: 1200,
    duration: "3-4 days",
    isActive: true,
  },
  {
    name: "Furniture Painting",
    category: "Painting",
    description: "Paint and refinish wooden furniture.",
    icon: "🪑",
    basePrice: 300,
    duration: "1-2 days",
    isActive: true,
  },

  // Water Pump Service
  {
    name: "Submersible Pump Repair",
    category: "Water Pump Service",
    description: "Repair and maintain submersible water pumps.",
    icon: "💧",
    basePrice: 400,
    duration: "2-3 hours",
    isActive: true,
  },
  {
    name: "Bore Well Pump Installation",
    category: "Water Pump Service",
    description: "Install new bore well pumps.",
    icon: "🚰",
    basePrice: 600,
    duration: "4-5 hours",
    isActive: true,
  },
  {
    name: "Motor Pump Service",
    category: "Water Pump Service",
    description: "Service and repair water motor pumps.",
    icon: "⚙️",
    basePrice: 250,
    duration: "1-2 hours",
    isActive: true,
  },

  // Solar Panel Maintenance
  {
    name: "Solar Panel Installation",
    category: "Solar Panel Maintenance",
    description: "Install solar panels for homes and farms.",
    icon: "☀️",
    basePrice: 5000,
    duration: "1-2 days",
    isActive: true,
  },
  {
    name: "Solar Panel Cleaning",
    category: "Solar Panel Maintenance",
    description: "Clean and maintain solar panels for efficiency.",
    icon: "🧼",
    basePrice: 300,
    duration: "2-3 hours",
    isActive: true,
  },
  {
    name: "Solar Inverter Repair",
    category: "Solar Panel Maintenance",
    description: "Repair and service solar inverters.",
    icon: "🔋",
    basePrice: 400,
    duration: "2-3 hours",
    isActive: true,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing services
    await Service.deleteMany({});
    console.log("🗑️  Cleared existing services");

    // Insert new services
    await Service.insertMany(services);
    console.log(`✅ Successfully seeded ${services.length} services`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
