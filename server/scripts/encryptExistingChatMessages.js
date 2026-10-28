// Run once after confirming ENCRYPTION_KEY is configured.
require("dotenv").config();
require("../src/config/env");

const connectDB = require("../src/config/database");
const Message = require("../src/models/Message");
const EncryptionUtil = require("../src/utils/encryptionUtil");

async function migrate() {
  try {
    await connectDB();

    const cursor = Message.find({
      message: { $not: /^enc:v1:/ }
    }).cursor();

    let updated = 0;

    for await (const message of cursor) {
      message.message = EncryptionUtil.encryptText(
        message.message || ""
      );
      await message.save();
      updated++;

      if (updated % 100 === 0) {
        console.log(`Encrypted ${updated} messages...`);
      }
    }

    console.log(
      `Migration complete. Updated ${updated} messages.`
    );
  } catch (error) {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  } finally {
    await require("mongoose").disconnect();
  }
}

migrate();
