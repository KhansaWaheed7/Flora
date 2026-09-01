const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("../src/config/database");
const User = require("../src/models/User");

const createDoctor = async () => {

  try {

    await connectDB();

    const email = process.env.DOCTOR_EMAIL || "doctor@flora.test";

    const existingDoctor = await User.findOne({ email });

    if (existingDoctor) {
      console.log("❌ A user with this email already exists:", email);
      process.exit(0);
    }

    const doctor = await User.create({

      fullName: process.env.DOCTOR_NAME || "Dr. Ayesha Khan",

      email,

      password: process.env.DOCTOR_PASSWORD || "Doctor@123",

      role: "doctor",

      accountStatus: "active",

      // Skip the email-verification + admin-approval flow so this
      // account can log in immediately - this is for local dev/testing
      // only, never do this via the public /auth/register endpoint.
      isEmailVerified: true,
      doctorApprovalStatus: "approved",

      specialization: process.env.DOCTOR_SPECIALIZATION || "Gynecology",
      licenseNumber: process.env.DOCTOR_LICENSE || "GY-12345-LHR",
      hospital: process.env.DOCTOR_HOSPITAL || "Lahore General Hospital",
      yearsOfExperience: Number(process.env.DOCTOR_EXPERIENCE) || 8,

    });

    console.log("✅ Doctor created successfully.");
    console.log(`Email: ${doctor.email}`);
    console.log(`Password: ${process.env.DOCTOR_PASSWORD || "Doctor@123"}`);

    process.exit(0);

  } catch (error) {

    console.error("❌ Failed to create doctor.");
    console.error(error);

    process.exit(1);

  }

};

createDoctor();
