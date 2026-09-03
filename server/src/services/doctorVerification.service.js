const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const cloudinary = require("../config/cloudinary");

const uploadDocument = async (
  userId,
  file,
  documentType
) => {
  if (!file) {
    throw new ApiError(
      400,
      "Document file is required."
    );
  }

  const allowedDocumentTypes = [
    "pmdc_certificate",
    "medical_degree",
    "specialist_certificate",
    "identity_document",
    "other",
  ];

  if (!allowedDocumentTypes.includes(documentType)) {
    throw new ApiError(
      400,
      "Invalid document type."
    );
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (user.role !== "doctor") {
    throw new ApiError(
      403,
      "Only doctors can upload verification documents."
    );
  }

  if (
    user.doctorVerification?.status === "verified"
  ) {
    throw new ApiError(
      400,
      "Your doctor account is already verified."
    );
  }

  // Find existing document of the same type
  const existingDocument =
    user.doctorVerification.documents.find(
      (doc) => doc.type === documentType
    );

  // Upload new document
  let result;

  try {
    result = await new Promise((resolve, reject) => {
      const stream =
        cloudinary.uploader.upload_stream(
          {
            folder: "flora/doctor-verification",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

      stream.end(file.buffer);
    });

    console.log("✅ Document uploaded to Cloudinary:", {
      publicId: result.public_id,
      url: result.secure_url,
      resourceType: result.resource_type,
    });

  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    throw new ApiError(
      500,
      "Failed to upload verification document: " + error.message
    );
  }

  const newDocument = {
    type: documentType,
    url: result.secure_url,
    publicId: result.public_id,
    resourceType: result.resource_type,
    originalName: file.originalname,
    uploadedAt: new Date(),
  };

  try {
    // Replace existing document
    if (existingDocument) {
      const index =
        user.doctorVerification.documents.findIndex(
          (doc) => doc.type === documentType
        );

      user.doctorVerification.documents[index] =
        newDocument;
    } else {
      // Add new document
      user.doctorVerification.documents.push(
        newDocument
      );
    }

    // New/re-uploaded document requires review again
    user.doctorVerification.status = "pending";

    // Clear previous rejection
    user.doctorVerification.rejectionReason = "";

    // Clear previous verification information
    user.doctorVerification.verifiedAt = null;
    user.doctorVerification.verifiedBy = null;

    await user.save();
    
    console.log("✅ Document saved to database for user:", userId);

  } catch (error) {
    console.error("❌ Database save error:", error);
    
    // Remove newly uploaded Cloudinary file
    try {
      await cloudinary.uploader.destroy(
        result.public_id,
        {
          resource_type:
            result.resource_type || "image",
        }
      );
    } catch (cleanupError) {
      console.error(
        "Failed to clean up uploaded Cloudinary document:",
        cleanupError
      );
    }

    throw error;
  }

  // Delete old Cloudinary document AFTER database update
  if (
    existingDocument &&
    existingDocument.publicId
  ) {
    try {
      await cloudinary.uploader.destroy(
        existingDocument.publicId,
        {
          resource_type:
            existingDocument.resourceType || "image",
        }
      );
    } catch (error) {
      console.error(
        "Failed to delete old Cloudinary document:",
        error
      );
    }
  }

  // Return useful document information
  return {
    type: newDocument.type,
    url: newDocument.url,
    publicId: newDocument.publicId,
    resourceType: newDocument.resourceType,
    originalName: newDocument.originalName,
    uploadedAt: newDocument.uploadedAt,
  };
};

module.exports = {
  uploadDocument,
};