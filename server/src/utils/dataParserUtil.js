// server/src/utils/dataParserUtil.js

const REFERENCE_RANGES = {
  hemoglobin: {
    female: { min: 12.0, max: 16.0, unit: "g/dL" },
    male: { min: 13.5, max: 17.5, unit: "g/dL" },
  },

  hematocrit: {
    female: { min: 36, max: 46, unit: "%" },
    male: { min: 41, max: 53, unit: "%" },
  },

  rbc: {
    female: { min: 4.0, max: 5.5, unit: "million/µL" },
    male: { min: 4.5, max: 6.0, unit: "million/µL" },
  },

  wbc: {
    min: 4.5,
    max: 11.0,
    unit: "thousand/µL",
  },

  platelets: {
    min: 150,
    max: 400,
    unit: "thousand/µL",
  },

  glucose: {
    min: 70,
    max: 100,
    unit: "mg/dL",
  },

  cholesterol: {
    min: 0,
    max: 200,
    unit: "mg/dL",
  },

  triglycerides: {
    min: 0,
    max: 150,
    unit: "mg/dL",
  },

  ldl: {
    min: 0,
    max: 100,
    unit: "mg/dL",
  },

  hdl: {
    min: 40,
    max: 60,
    unit: "mg/dL",
  },

  creatinine: {
    female: { min: 0.6, max: 1.1, unit: "mg/dL" },
    male: { min: 0.7, max: 1.3, unit: "mg/dL" },
  },

  sodium: {
    min: 135,
    max: 145,
    unit: "mEq/L",
  },

  potassium: {
    min: 3.5,
    max: 5.0,
    unit: "mEq/L",
  },

  calcium: {
    min: 8.5,
    max: 10.2,
    unit: "mg/dL",
  },

  albumin: {
    min: 3.5,
    max: 5.5,
    unit: "g/dL",
  },
};

class DataParserUtil {
  /**
   * Parse extracted text and find medical data
   */
  static parseExtractedText(text, gender = "female") {
    const extractedData = [];
    const seenTests = new Set();

    // Comprehensive pattern for finding test values
    const patterns = [
  // Pattern 1:
  // "Hemoglobin: 13.5 g/dL"
  /([a-z][a-z0-9\s\-()/]+?)\s*:\s*([\d]+(?:\.\d+)?)\s*([a-zµμ/%°0-9^]+(?:\/[a-zµμ%°0-9^]+)*)?/gi,

  // Pattern 2:
  // "Hemoglobin    13.5    g/dL"
  /([a-z][a-z0-9\s\-()/]+?)\s{2,}([\d]+(?:\.\d+)?)\s+([a-zµμ/%°0-9^]+(?:\/[a-zµμ%°0-9^]+)*)/gi,

  // Pattern 3:
  // "Hb (Hemoglobin): 13.5"
  /([a-z][a-z0-9\s\-]+?)\s*\([a-z][a-z0-9\s\-]*\)\s*:\s*([\d]+(?:\.\d+)?)\s*([a-zµμ/%°0-9^]+(?:\/[a-zµμ%°0-9^]+)*)?/gi,

  // Pattern 4:
  // "Hb: 13.5"
  /([a-z][a-z0-9\s\-]+?)\s*:\s*([\d]+(?:\.\d+)?)/gi,
];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const rawTestName = match[1].trim().toLowerCase();
        const value = parseFloat(match[2]);
        const unit = match[3] ? match[3].trim() : "";

        const normalizedName = this.normalizeTestName(rawTestName);

if (
  !seenTests.has(normalizedName) &&
  !isNaN(value) &&
  rawTestName.length > 2
) {
          const normalizedName = this.normalizeTestName(rawTestName);
const referenceRange = this.getReferenceRange(normalizedName, gender);

          extractedData.push({
            test: normalizedName || rawTestName,
            value: match[2],
            unit: unit || (referenceRange ? referenceRange.unit : ""),
            referenceRange: referenceRange
              ? `${referenceRange.min}-${referenceRange.max} ${referenceRange.unit}`
              : "N/A",
            status: this.determineStatus(value, referenceRange),
            confidence: 85,
          });

          seenTests.add(normalizedName);
        }
      }
    }

    return extractedData;
  }

  /**
   * Normalize test names to standard format
   */
  static normalizeTestName(name) {
    const nameMap = {
      hb: "hemoglobin",
      hemoglobin: "hemoglobin",
      hct: "hematocrit",
      hematocrit: "hematocrit",
      rbc: "rbc",
      wbc: "wbc",
      platelet: "platelets",
      platelets: "platelets",
      glucose: "glucose",
      blood_glucose: "glucose",
      fasting_glucose: "glucose",
      sugar: "glucose",
      cholesterol: "cholesterol",
      total_cholesterol: "cholesterol",
      ldl: "ldl",
      "ldl cholesterol": "ldl",
      hdl: "hdl",
      "hdl cholesterol": "hdl",
      triglyceride: "triglycerides",
      triglycerides: "triglycerides",
      creatinine: "creatinine",
      serum_creatinine: "creatinine",
      sodium: "sodium",
      na: "sodium",
      potassium: "potassium",
      k: "potassium",
      calcium: "calcium",
      ca: "calcium",
      albumin: "albumin",
      alb: "albumin",
    };

    return nameMap[name] || name;
  }


  static getReferenceRange(testName, gender = "female") {
  const reference = REFERENCE_RANGES[testName];

  if (!reference) {
    return null;
  }

  if (reference.female && reference.male) {
    return reference[gender] || reference.female;
  }

  return reference;
}

  /**
   * Determine if value is normal, low, or high
   */
  static determineStatus(value, referenceRange) {
    if (!referenceRange) return "unknown";

    if (value < referenceRange.min) return "low";
    if (value > referenceRange.max) return "high";
    return "normal";
  }

  /**
   * Identify abnormal results
   */
  static findAbnormalResults(extractedData) {
    return extractedData
      .filter((item) => item.status !== "normal" && item.status !== "unknown")
      .map((item) => ({
        ...item,
        severity: this.calculateSeverity(item),
        recommendation: this.getRecommendation(item),
      }));
  }

  /**
   * Calculate severity of abnormal result (mild, moderate, severe)
   */
  static calculateSeverity(result) {
    const value = parseFloat(result.value);
    const range = result.referenceRange;

    if (!range || range === "N/A") return "mild";

    const numbers = range.match(/[\d.]+/g);
    if (numbers.length < 2) return "mild";

    const [min, max] = [parseFloat(numbers[0]), parseFloat(numbers[1])];
    const midpoint = (min + max) / 2;

    if (result.status === "low") {
      const deviation = (min - value) / Math.abs(min);
      if (deviation > 0.5) return "severe";
      if (deviation > 0.2) return "moderate";
    } else if (result.status === "high") {
      const deviation = (value - max) / Math.abs(max);
      if (deviation > 0.5) return "severe";
      if (deviation > 0.2) return "moderate";
    }

    return "mild";
  }

  /**
   * Get recommendation for abnormal result
   */
  static getRecommendation(result) {
    const recommendations = {
      low: `${result.test} is lower than normal. This may require medical evaluation.`,
      high: `${result.test} is higher than normal. This may require medical evaluation.`,
      abnormal: "This result is abnormal and needs medical attention.",
    };

    return (
      recommendations[result.status] || "Please consult a healthcare professional."
    );
  }
}

module.exports = DataParserUtil;