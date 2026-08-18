const multer = require("multer");

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/plain",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

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