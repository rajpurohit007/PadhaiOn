const User = require("../models/User");

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@padhaion.com" });
    if (!adminExists) {
      const admin = new User({
        name: "Admin",
        email: "admin@padhaion.com",
        password: "admin123",
        userType: "admin",
        isActive: true,
        isVerified: true,
      });
      await admin.save();
      console.log("✅ Admin created: admin@padhaion.com / admin123");
    } else {
      console.log("ℹ️ Admin already exists");
    }
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
  }
};

module.exports = seedAdmin;