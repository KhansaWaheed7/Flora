// server/src/middlewares/medicalReportUpload.middleware.js (UPDATED)
const multer = require("multer");

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/plain",
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB for medical reports

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new Error(
        "Invalid file type. Only PDF, JPG, PNG, WEBP, and TXT files are allowed."
      ),
      false
    );
  }

  // Validate file extension matches MIME type
  const validExtensions = {
    "application/pdf": [".pdf"],
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/webp": [".webp"],
    "text/plain": [".txt"],
  };

  const fileExt = require("path").extname(file.originalname).toLowerCase();
  const allowedExts = validExtensions[file.mimetype] || [];

  if (!allowedExts.includes(fileExt)) {
    return cb(
      new Error("File extension does not match the file type."),
      false
    );
  }

  cb(null, true);
};

const medicalReportUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

module.exports = medicalReportUpload;