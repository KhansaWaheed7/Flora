const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("../config/database");
const User = require("../models/User");

const createAdmin = async () => {

  try {

    await connectDB();

    const existingAdmin = await User.findOne({
      role: "admin",
    });

    if (existingAdmin) {
      console.log("❌ Admin already exists.");
      process.exit(0);
    }

    const admin = await User.create({

      fullName: process.env.ADMIN_NAME,

      email: process.env.ADMIN_EMAIL,

      password: process.env.ADMIN_PASSWORD,

      role: "admin",

      accountStatus: "active",

      isEmailVerified: true,

      doctorApprovalStatus: "approved",

    });

    console.log("✅ Admin created successfully.");
    console.log(`Email: ${admin.email}`);

    process.exit(0);

  } catch (error) {

    console.error("❌ Failed to create admin.");
    console.error(error);

    process.exit(1);

  }

};

createAdmin();
