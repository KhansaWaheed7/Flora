// server/src/utils/ocrUtil.js
const Tesseract = require("tesseract.js");
const { PDFParse } = require("pdf-parse");

class OCRUtil {
  /**
   * Extract text from PDF buffer
   */
  static async extractTextFromPDF(buffer) {
  try {
    if (!buffer || !Buffer.isBuffer(buffer)) {
      throw new Error("Invalid PDF buffer");
    }

    const parser = new PDFParse({
      data: buffer,
    });

    const result = await parser.getText();

    await parser.destroy();

    const text = result?.text || "";

    console.log(
      `PDF extracted ${text.length} characters from ${
        result?.total || 0
      } pages`
    );

    if (!text.trim()) {
      throw new Error("PDF contains no extractable text");
    }

    return text;
  } catch (error) {
    console.error("PDF extraction error:", error);

    throw new Error(
      `Failed to extract text from PDF: ${error.message}`
    );
  }
}

  /**
   * Extract text from image using Tesseract OCR
   */
  static async extractTextFromImage(buffer) {
    try {
      const result = await Tesseract.recognize(buffer, "eng", {
        logger: (m) => console.log("OCR Progress:", m),
      });
      return result.data.text;
    } catch (error) {
      console.error("Image OCR error:", error);
      throw new Error("Failed to extract text from image");
    }
  }

  /**
   * Clean and preprocess extracted text
   */
  static cleanText(text) {
  if (!text) {
    return "";
  }

  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .filter(Boolean)
    .join("\n")
    .trim();
}

  /**
   * Detect report type from text
   */
  static detectReportType(text) {
    const lowerText = text.toLowerCase();

    const typePatterns = {
  "Blood Test":
    /\b(blood test|blood work|cbc|hemoglobin|hematocrit|rbc|wbc|platelets|complete blood count)\b/i,

  "Urine Test":
    /\b(urine test|urinalysis|urine examination|urine routine|urine microscopy)\b/i,

  Ultrasound:
    /\b(ultrasound|sonography|echography)\b/i,

  "X-Ray":
    /\b(x-ray|xray|radiography|roentgen)\b/i,

  "CT Scan":
    /\b(ct scan|computed tomography|cat scan)\b/i,

  MRI:
    /\b(mri|magnetic resonance imaging)\b/i,

  Pathology:
    /\b(pathology|microscopy|biopsy|histopathology)\b/i,

  Cardiology:
    /\b(ecg|ekg|cardiac|heart|troponin|echocardiogram)\b/i,

  Gynecology:
    /\b(gynecology|gynaecology|gynecological|gyn|pap smear|pap test|cervical|obstetric|ovarian)\b/i,

  "Thyroid Test":
    /\b(thyroid|tsh|t3|t4)\b/i,

  "Liver Function":
    /\b(liver function|liver profile|sgpt|sgot|alt|ast|alp|bilirubin)\b/i,

  "Kidney Function":
    /\b(kidney function|renal function|renal profile|creatinine|urea|bun)\b/i,
};

    for (const [type, pattern] of Object.entries(typePatterns)) {
      if (pattern.test(text)) {
        return type;
      }
    }

    return "Unknown";
  }
}

module.exports = OCRUtil;