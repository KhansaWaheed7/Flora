// Run once after setting the same ENCRYPTION_KEY used by the server:
// node scripts/encryptExistingChatMessages.js
require("dotenv").config();
require("../src/config/env");
const connectDB = require("../src/config/database");
const Message = require("../src/models/Message");
const EncryptionUtil = require("../src/utils/encryptionUtil");

async function migrate() {
  await connectDB();
  const cursor = Message.find({ message: { $not: /^enc:v1:/ } }).cursor();
  let updated = 0;
  try {
    for await (const message of cursor) {
      message.message = EncryptionUtil.encryptText(message.message || "");
      await message.save();
      updated += 1;
      if (updated % 100 === 0) console.log(`Encrypted ${updated} messages...`);
    }
    console.log(`Chat message encryption migration complete. Updated ${updated} records.`);
    process.exitCode = 0;
  } catch (error) {
    console.error("Chat message migration failed:", error);
    process.exitCode = 1;
  } finally {
    const mongoose = require("mongoose");
    await mongoose.disconnect();
  }
}

migrate();
