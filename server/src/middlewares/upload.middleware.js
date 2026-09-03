const multer = require("multer");

const storage = multer.memoryStorage();

// Create multer instance
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter(req, file, cb) {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    cb(
      new Error(
        "Only JPG, PNG, WEBP, or PDF files are allowed."
      )
    );
  },
});

// Middleware for single file upload
const handleSingleUpload = (req, res, next) => {
  upload.single("document")(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File size must not exceed 5 MB.",
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    next();
  });
};

// Export the multer instance and middleware
module.exports = upload;
module.exports.handleSingleUpload = handleSingleUpload;