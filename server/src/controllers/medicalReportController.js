// server/src/controllers/medicalReportController.js
const MedicalReport = require("../models/MedicalReport");
const EncryptionUtil = require("../utils/encryptionUtil");
const OCRUtil = require("../utils/ocrUtil");
const DataParserUtil = require("../utils/dataParserUtil");
const MedicalAIUtil = require("../utils/medicalAIUtil");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

class MedicalReportController {
  /**
   * Upload and process medical report
   */
  static uploadReport = asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError(400, "No file provided");
    }

    // FIX: Check if user exists
    if (!req.user) {
      throw new ApiError(401, "User not authenticated");
    }

    const userId = req.user._id;
    const file = req.file;

    // Generate file hash
    const fileHash = EncryptionUtil.generateHash(file.buffer);

    // Check for duplicate
    const existingReport = await MedicalReport.findOne({ fileHash });
    if (existingReport) {
      throw new ApiError(400, "This file has already been uploaded");
    }

    // Determine file type
    const fileType = this.getFileType(file.mimetype);

    // Encrypt buffer
    const encryption = EncryptionUtil.encryptBuffer(file.buffer);

    // Create report
    const report = new MedicalReport({
      user: userId,
      fileName: file.originalname,
      fileType,
      mimeType: file.mimetype,
      fileHash,
      fileSize: file.size,
      encryptedData: encryption.encryptedData,
      encryptionIV: encryption.iv,
      encryptionAuthTag: encryption.authTag,
      processingStatus: "uploaded",
      metadata: {
        uploadedFrom: req.body.uploadedFrom || "web",
        userAgent: req.get("user-agent"),
      },
    });

    await report.save();

    // Process asynchronously
    this.processReportAsync(report._id, file.buffer, fileType);

    return res.status(201).json({
      success: true,
      message: "Report uploaded successfully. Processing in progress...",
      data: {
        reportId: report._id,
        fileName: report.fileName,
        processingStatus: report.processingStatus,
      },
    });
  });

  /**
   * Determine file type from MIME type
   */
  static getFileType(mimeType) {
    if (mimeType === "application/pdf") return "pdf";
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType === "text/plain") return "text";
    return "unknown";
  }

  /**
   * Process report asynchronously
   */
  static async processReportAsync(reportId, fileBuffer, fileType) {
    try {
      const report = await MedicalReport.findById(reportId);

      if (!report) {
        console.error(`Report ${reportId} not found`);
        return;
      }

      // Step 1: Update status to processing
      report.processingStatus = "processing";
      await report.save();

      let extractedText = "";

      // Step 2: Extract text based on file type
      if (fileType === "pdf") {
        extractedText = await OCRUtil.extractTextFromPDF(fileBuffer);
      } else if (fileType === "image") {
        extractedText = await OCRUtil.extractTextFromImage(fileBuffer);
      } else if (fileType === "text") {
        extractedText = fileBuffer.toString("utf-8");
      }

      extractedText = OCRUtil.cleanText(extractedText);
      report.extractedText = extractedText;
      report.reportType = OCRUtil.detectReportType(extractedText);
      report.processingStatus = "ocr_done";
      await report.save();

      // Step 3: Parse data
      // Step 3: AI + RAG analysis
report.processingStatus = "parsing_done";
await report.save();

const aiAnalysis = await MedicalAIUtil.analyzeReport(
  extractedText
);

// Store AI analysis
report.aiAnalysis = {
  reportType: aiAnalysis.reportType,
  overview: aiAnalysis.overview,
  keyFindings: aiAnalysis.keyFindings,
  recommendations: aiAnalysis.recommendations,
  whenToSeeDoctor: aiAnalysis.whenToSeeDoctor,
  disclaimer: aiAnalysis.disclaimer,
  model: "gemini-3.6-flash",
  ragUsed: aiAnalysis.ragUsed || false,
  analyzedAt: new Date(),
};

// Store structured test results
report.extractedData = aiAnalysis.tests.map((test) => ({
  test: test.test,
  value: test.value,
  unit: test.unit || "",
  reportReferenceRange: test.reportReferenceRange || "",
  knowledgeReferenceRange: test.knowledgeReferenceRange || "",
  referenceSource: test.referenceSource || "none",
  status: test.status || "unknown",
  confidence: test.confidence || 0,
  explanation: test.explanation || "",
}));

// Store abnormal results
report.abnormalResults = aiAnalysis.abnormalResults || [];

// Backward-compatible summary
report.summary = aiAnalysis.overview || "";

// Backward-compatible insights
report.insights = {
  overview: aiAnalysis.overview || "",
  keyFindings: aiAnalysis.keyFindings || [],
  normalResults: aiAnalysis.normalResults || [],
  recommendations: aiAnalysis.recommendations || [],
  whenToSeeDoctor: aiAnalysis.whenToSeeDoctor || "",
};

report.processingStatus = "completed";

await report.save();

console.log(
  `✅ AI + RAG analysis completed for report ${reportId}`
);

      console.log(`✅ Report ${reportId} processing completed`);
    } catch (error) {
      console.error(`❌ Error processing report ${reportId}:`, error);
      try {
        const report = await MedicalReport.findById(reportId);
        if (report) {
          report.processingStatus = "failed";
          report.processingError = error.message;
          await report.save();
        }
      } catch (saveError) {
        console.error("Error saving failed status:", saveError);
      }
    }
  }

  /**
   * Get report by ID
   */
  static getReportById = asyncHandler(async (req, res) => {
    // FIX: Check if user exists
    if (!req.user) {
      throw new ApiError(401, "User not authenticated");
    }

    const reportId = req.params.id;
    const userId = req.user._id;

    // FIX: Validate MongoDB ID format
    if (!reportId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new ApiError(400, "Invalid report ID format");
    }

    const report = await MedicalReport.findById(reportId);

    if (!report) {
      throw new ApiError(404, "Report not found");
    }

    // FIX: Safe comparison
    const isOwner = report.user && report.user.toString() === userId.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      throw new ApiError(403, "Unauthorized access");
    }

    // Log access
    report.accessLog.push({
      accessedBy: userId,
      action: "viewed",
    });
    await report.save();

    return res.status(200).json({
      success: true,
      data: report,
    });
  });

  /**
   * Get all reports for user
   */
  static getUserReports = asyncHandler(async (req, res) => {
    // FIX: Check if user exists
    if (!req.user) {
      throw new ApiError(401, "User not authenticated");
    }

    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // FIX: Validate pagination
    if (page < 1 || limit < 1 || limit > 100) {
      throw new ApiError(400, "Invalid pagination parameters");
    }

    const reports = await MedicalReport.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-extractedText -encryptedData -accessLog");

    const total = await MedicalReport.countDocuments({ user: userId });

    return res.status(200).json({
      success: true,
      data: reports,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  });

  /**
   * Download report
   */
  static downloadReport = asyncHandler(async (req, res) => {
    // FIX: Check if user exists
    if (!req.user) {
      throw new ApiError(401, "User not authenticated");
    }

    const reportId = req.params.id;
    const userId = req.user._id;

    // FIX: Validate MongoDB ID format
    if (!reportId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new ApiError(400, "Invalid report ID format");
    }

    const report = await MedicalReport.findById(reportId);

    if (!report) {
      throw new ApiError(404, "Report not found");
    }

    // FIX: Safe comparison
    const isOwner = report.user && report.user.toString() === userId.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      throw new ApiError(403, "Unauthorized access");
    }

    // FIX: Check if encrypted data exists
    if (!report.encryptedData) {
      throw new ApiError(500, "Report file not found");
    }

    // Decrypt file
    const decryptedBuffer = EncryptionUtil.decryptBuffer(
      report.encryptedData,
      report.encryptionIV,
      report.encryptionAuthTag
    );

    // Log access
    report.accessLog.push({
      accessedBy: userId,
      action: "downloaded",
    });
    await report.save();

    // Send file
    res.setHeader("Content-Type", report.mimeType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${report.fileName}"`
    );
    res.send(decryptedBuffer);
  });

  /**
   * Delete report
   */
  static deleteReport = asyncHandler(async (req, res) => {
    // FIX: Check if user exists
    if (!req.user) {
      throw new ApiError(401, "User not authenticated");
    }

    const reportId = req.params.id;
    const userId = req.user._id;

    // FIX: Validate MongoDB ID format
    if (!reportId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new ApiError(400, "Invalid report ID format");
    }

    const report = await MedicalReport.findById(reportId);

    if (!report) {
      throw new ApiError(404, "Report not found");
    }

    // FIX: Safe comparison
    const isOwner = report.user && report.user.toString() === userId.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      throw new ApiError(403, "Unauthorized access");
    }

    await MedicalReport.findByIdAndDelete(reportId);

    return res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  });

  /**
   * Get report summary only
   */
  static getReportSummary = asyncHandler(async (req, res) => {
    // FIX: Check if user exists
    if (!req.user) {
      throw new ApiError(401, "User not authenticated");
    }

    const reportId = req.params.id;
    const userId = req.user._id;

    // FIX: Validate MongoDB ID format
    if (!reportId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new ApiError(400, "Invalid report ID format");
    }

    const report = await MedicalReport.findById(reportId).select(
  "user fileName reportType summary insights abnormalResults processingStatus createdAt"
);

    if (!report) {
      throw new ApiError(404, "Report not found");
    }

    // FIX: Safe comparison
    const isOwner = report.user && report.user.toString() === userId.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      throw new ApiError(403, "Unauthorized access");
    }

    return res.status(200).json({
      success: true,
      data: report,
    });
  });

  /**
   * Get processing status
   */
  static getProcessingStatus = asyncHandler(async (req, res) => {
    // FIX: Check if user exists
    if (!req.user) {
      throw new ApiError(401, "User not authenticated");
    }

    const reportId = req.params.id;
    const userId = req.user._id;

    // FIX: Validate MongoDB ID format
    if (!reportId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new ApiError(400, "Invalid report ID format");
    }

    const report = await MedicalReport.findById(reportId).select(
      "processingStatus processingError user"
    );

    if (!report) {
      throw new ApiError(404, "Report not found");
    }

    // FIX: Safe comparison
    const isOwner = report.user && report.user.toString() === userId.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      throw new ApiError(403, "Unauthorized access");
    }

    return res.status(200).json({
      success: true,
      data: {
        reportId,
        processingStatus: report.processingStatus,
        processingError: report.processingError || "",
      },
    });
  });
}



module.exports = MedicalReportController;

