const multer = require("multer");

const ALLOWED_MIME_TYPES = [
  // Documents
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  // Images
  "image/jpeg",
  "image/png",
  "image/webp",

  // Audio
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
];

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

const storage = multer.memoryStorage();

const path = require("path");

const fileFilter = (req, file, cb) => {
  console.log("📎 Chat attachment received:");
  console.log("Original name:", file.originalname);
  console.log("MIME type:", file.mimetype);

  const fileExt = path.extname(file.originalname).toLowerCase();

  const allowedExtensions = [
    ".pdf",
    ".txt",
    ".doc",
    ".docx",
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".mp3",
    ".wav",
    ".ogg",
  ];

  // Normal MIME validation
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(null, true);
  }

  // Some systems/browsers send files as application/octet-stream.
  // In that case, validate using the file extension.
  if (
    file.mimetype === "application/octet-stream" &&
    allowedExtensions.includes(fileExt)
  ) {
    console.log(
      `⚠️ Generic MIME type detected (${file.mimetype}), accepted based on extension: ${fileExt}`
    );

    return cb(null, true);
  }

  return cb(
    new Error(
      "Invalid file type. Allowed files are PDF, TXT, DOC, DOCX, JPG, PNG, WEBP, MP3, WAV, and OGG."
    ),
    false
  );
};

const chatAttachmentUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

module.exports = chatAttachmentUpload;