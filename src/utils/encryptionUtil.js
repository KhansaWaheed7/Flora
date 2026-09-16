// server/src/utils/encryptionUtil.js
const crypto = require("crypto");
const fs = require("fs").promises;
const path = require("path");

const ENCRYPTION_ALGORITHM = "aes-256-gcm";

if (!process.env.ENCRYPTION_KEY) {
  throw new Error("ENCRYPTION_KEY is required in environment variables");
}

const ENCRYPTION_KEY = crypto
  .createHash("sha256")
  .update(process.env.ENCRYPTION_KEY)
  .digest();

class EncryptionUtil {
  /**
   * Encrypt buffer (for memory stored files)
   */
  static encryptBuffer(buffer) {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, ENCRYPTION_KEY, iv);

      let encrypted = cipher.update(buffer);
      encrypted = Buffer.concat([encrypted, cipher.final()]);

      const authTag = cipher.getAuthTag();

      return {
        encryptedData: encrypted,
        iv: iv.toString("hex"),
        authTag: authTag.toString("hex"),
        algorithm: ENCRYPTION_ALGORITHM,
      };
    } catch (error) {
      console.error("Encryption error:", error);
      throw new Error("Buffer encryption failed");
    }
  }

  /**
   * Decrypt buffer
   */
  static decryptBuffer(encryptedData, ivHex, authTagHex) {
    try {
      const iv = Buffer.from(ivHex, "hex");
      const authTag = Buffer.from(authTagHex, "hex");
      const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, ENCRYPTION_KEY, iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encryptedData);
      decrypted = Buffer.concat([decrypted, decipher.final()]);

      return decrypted;
    } catch (error) {
      console.error("Decryption error:", error);
      throw new Error("Buffer decryption failed");
    }
  }

  /**
   * Generate file hash for integrity verification
   */
  static generateHash(buffer) {
    return crypto.createHash("sha256").update(buffer).digest("hex");
  }

  /**
   * Store file securely to disk (optional)
   */
  static async saveEncryptedFile(buffer, filename, uploadDir) {
    try {
      await fs.mkdir(uploadDir, { recursive: true });

      const encryption = this.encryptBuffer(buffer);
      const filePath = path.join(uploadDir, filename);

      // Save encrypted file with metadata
      const fileData = {
        data: encryption.encryptedData,
        iv: encryption.iv,
        authTag: encryption.authTag,
      };

      await fs.writeFile(filePath, JSON.stringify(fileData));
      return filePath;
    } catch (error) {
      console.error("Save encrypted file error:", error);
      throw error;
    }
  }

  /**
   * Load and decrypt file from disk
   */
  static async loadEncryptedFile(filePath) {
    try {
      const data = await fs.readFile(filePath, "utf-8");
      const fileData = JSON.parse(data);

      return this.decryptBuffer(
        Buffer.from(fileData.data),
        fileData.iv,
        fileData.authTag
      );
    } catch (error) {
      console.error("Load encrypted file error:", error);
      throw error;
    }
  }
}

module.exports = EncryptionUtil;