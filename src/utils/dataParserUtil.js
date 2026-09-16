/**
 * Medical Report Data Parser
 *
 * Supports:
 * - Colon format:
 *     Hemoglobin: 13.5 g/dL
 *
 * - Structured laboratory table rows:
 *     Hemoglobin 10.8 g/dL 12.0–15.5 g/dL LOW / ABNORMAL
 *
 * - Qualitative results:
 *     Protein Negative Negative Normal
 *
 * - Report-provided reference ranges
 * - Report-provided status
 * - Hard-coded reference ranges as fallback
 * - Previously unknown/new test names
 */

class DataParserUtil {
  /**
   * Fallback reference ranges.
   *
   * IMPORTANT:
   * These are only used when the uploaded report does NOT
   * provide a reference range.
   */
  static REFERENCE_RANGES = {
    hemoglobin: {
      min: 12,
      max: 15.5,
      unit: "g/dL",
    },

    hematocrit: {
      min: 36,
      max: 46,
      unit: "%",
    },

    rbc: {
      min: 3.8,
      max: 5.2,
      unit: "million/µL",
    },

    "rbc count": {
      min: 3.8,
      max: 5.2,
      unit: "million/µL",
    },

    wbc: {
      min: 4000,
      max: 11000,
      unit: "/µL",
    },

    "wbc count": {
      min: 4000,
      max: 11000,
      unit: "/µL",
    },

    platelets: {
      min: 150000,
      max: 450000,
      unit: "/µL",
    },

    glucose: {
      min: 70,
      max: 99,
      unit: "mg/dL",
    },

    cholesterol: {
      min: 0,
      max: 200,
      unit: "mg/dL",
    },

    "total cholesterol": {
      min: 0,
      max: 200,
      unit: "mg/dL",
    },

    ldl: {
      min: 0,
      max: 100,
      unit: "mg/dL",
    },

    "ldl cholesterol": {
      min: 0,
      max: 100,
      unit: "mg/dL",
    },

    hdl: {
      min: 50,
      max: Infinity,
      unit: "mg/dL",
    },

    "hdl cholesterol": {
      min: 50,
      max: Infinity,
      unit: "mg/dL",
    },

    triglycerides: {
      min: 0,
      max: 150,
      unit: "mg/dL",
    },

    creatinine: {
      min: 0.5,
      max: 1.1,
      unit: "mg/dL",
    },

    albumin: {
      min: 3.5,
      max: 5,
      unit: "g/dL",
    },
  };

  /**
   * Main parser.
   */
  static parseExtractedText(text) {
  if (!text || typeof text !== "string") {
    return [];
  }

  const lines = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) =>
      line
        .replace(/\*\*/g, "")
        .replace(/\s+/g, " ")
        .trim()
    )
    .filter(Boolean);

  const results = [];

  for (const line of lines) {
    const parsed = this.parseLine(line);

    if (parsed) {
      results.push(parsed);
    }
  }

  return this.removeDuplicates(results);
}

  /**
   * Parse one line.
   */
  static parseLine(line) {
  if (this.isHeaderOrMetadata(line)) {
    return null;
  }

  // 1. Structured laboratory table row
  const tableResult = this.parseStructuredRow(line);

  if (tableResult) {
    return tableResult;
  }

  // 2. Colon format
  const colonResult = this.parseColonFormat(line);

  if (colonResult) {
    return colonResult;
  }

  // 3. Generic unknown laboratory result
  const unknownResult = this.parseUnknownResult(line);

  if (unknownResult) {
    return unknownResult;
  }

  return null;
}

  /**
   * Detect lines that aren't laboratory results.
   */
  static isHeaderOrMetadata(line) {
    const normalized = line.toLowerCase();

    const ignored = [
      "medical laboratory report",
      "patient name",
      "patient id",
      "date of report",
      "date:",
      "gender:",
      "age:",
      "gender",
      "patient:",
      "medical record",
      "report date",
      "sample date",
      "collection date",
      "complete blood count",
      "cbc",
      "iron studies",
      "blood glucose",
      "kidney function",
      "liver function",
      "thyroid function",
      "lipid profile",
      "urinalysis",
      "laboratory impression",
      "test result reference range status",
      "test result",
      "reference range",
      "important:",
    ];

    return ignored.some((value) => normalized.startsWith(value));
  }

  /**
   * Parse:
   *
   * Hemoglobin 10.8 g/dL 12.0–15.5 g/dL LOW / ABNORMAL
   */
  static parseStructuredRow(line) {
  const normalized = line
    .replace(/\|/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return null;
  }

  // ---------------------------------------------------------
  // 1. Extract status from the row
  // ---------------------------------------------------------

  const status = this.extractStatus(normalized);

  let content = normalized;

  if (status) {
    const statusPatterns = [
      /\bslightly\s+high\s*\/\s*abnormal\b/i,
      /\bslightly\s+low\s*\/\s*abnormal\b/i,
      /\blow\s*\/\s*abnormal\b/i,
      /\bhigh\s*\/\s*abnormal\b/i,
      /\bslightly\s+high\b/i,
      /\bslightly\s+low\b/i,
      /\babnormal\b/i,
      /\bnormal\b/i,
      /\bhigh\b/i,
      /\blow\b/i,
    ];

    for (const pattern of statusPatterns) {
      content = content.replace(pattern, " ");
    }

    content = content.replace(/\s+/g, " ").trim();
  }

  // ---------------------------------------------------------
  // 2. Find the reference range
  //
  // Examples:
  // 12.0–15.5 g/dL
  // 3.5–5.0 g/dL
  // <200 mg/dL
  // ≥50 mg/dL
  // >90
  // ---------------------------------------------------------

  const rangePatterns = [
    /(-?\d+(?:,\d{3})?(?:\.\d+)?\s*[–—-]\s*-?\d+(?:,\d{3})?(?:\.\d+)?(?:\s*[a-zA-Zµμ/%][a-zA-Zµμ/%0-9.^²³/²-]*)?)/,

    /([<>≤≥]\s*-?\d+(?:,\d{3})?(?:\.\d+)?(?:\s*[a-zA-Zµμ/%][a-zA-Zµμ/%0-9.^²³/²-]*)?)/,
  ];

  let referenceMatch = null;

  for (const pattern of rangePatterns) {
    const match = content.match(pattern);

    if (match) {
      referenceMatch = match;
      break;
    }
  }

  // ---------------------------------------------------------
  // 3. Reference range found
  // ---------------------------------------------------------

  if (referenceMatch) {
    const referenceRange = referenceMatch[1].trim();

    // Everything before reference range
    const beforeReference = content
      .slice(0, referenceMatch.index)
      .trim();

    if (!beforeReference) {
      return null;
    }

    // -------------------------------------------------------
    // Extract the FIRST numeric value from the test section
    // -------------------------------------------------------

    const valueMatch = beforeReference.match(
      /(-?\d+(?:,\d{3})?(?:\.\d+)?)\s*([a-zA-Zµμ/%][a-zA-Zµμ/%0-9.^²³/²-]*)?/
    );

    if (!valueMatch) {
      return null;
    }

    const value = Number(
      valueMatch[1].replace(/,/g, "")
    );

    const unit = this.normalizeUnit(
      valueMatch[2] || this.extractUnit(referenceRange)
    );

    // Test name is everything before the numeric value
    const testName = beforeReference
      .slice(0, valueMatch.index)
      .trim();

    if (!testName) {
      return null;
    }

    if (!this.looksLikeTestName(testName)) {
      return null;
    }

    const parsedRange =
      this.parseReferenceRange(referenceRange);

    // -------------------------------------------------------
    // Determine final status
    // -------------------------------------------------------

    let finalStatus = status;

    /*
     * If the report explicitly says:
     *
     * LOW
     * HIGH
     * NORMAL
     * ABNORMAL
     *
     * trust the report.
     *
     * Otherwise calculate from its reference range.
     */

    if (!finalStatus && parsedRange) {
      finalStatus = this.determineStatus(
        value,
        parsedRange,
        unit
      );
    }

    if (!finalStatus) {
      finalStatus = "unknown";
    }

    return {
      test: this.normalizeTestName(testName),
      value,
      unit: unit || null,
      referenceRange,
      status: finalStatus,
      source: "report",
    };
  }

  // ---------------------------------------------------------
  // 4. No reference range
  //
  // Try qualitative results such as:
  //
  // Protein Negative Negative Normal
  // ---------------------------------------------------------

  const qualitativeResult =
    this.parseQualitativeRow(normalized);

  if (qualitativeResult) {
    return qualitativeResult;
  }

  // ---------------------------------------------------------
  // 5. No reference range
  //
  // Allow generic numeric result to continue through parser.
  // ---------------------------------------------------------

  return this.parseUnknownResult(normalized);
}

  /**
   * Parse:
   *
   * Hemoglobin: 13.5 g/dL
   */
  static parseColonFormat(line) {
    const match = line.match(/^(.+?)\s*:\s*(.+)$/);

    if (!match) {
      return null;
    }

    const testName = match[1].trim();
    const remainder = match[2].trim();

    if (!this.looksLikeTestName(testName)) {
      return null;
    }

    // Don't accidentally interpret patient metadata as tests.
    const blockedNames = [
      "patient name",
      "patient id",
      "date",
      "date of report",
      "age",
      "gender",
    ];

    if (blockedNames.includes(testName.toLowerCase())) {
      return null;
    }

    const valueMatch = this.extractValue(remainder);

    if (!valueMatch) {
      return null;
    }

    const value = valueMatch.value;
    const unit = valueMatch.unit || null;

    const fallback = this.findReferenceRange(testName);

    let status = "unknown";

    if (fallback) {
      status = this.determineStatus(
  value,
  fallback,
  unit
);
    }

    return {
      test: this.normalizeTestName(testName),
      value,
      unit,
      referenceRange: fallback
        ? this.formatFallbackRange(fallback)
        : null,
      status,
      source: fallback ? "fallback" : "report",
    };
  }

  static parseUnknownResult(line) {
  const normalized = line
    .replace(/\|/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  /*
   * Example:
   *
   * Vitamin B12 350 pg/mL
   * CRP 4.2 mg/L
   * Some New Test 12.5 units
   */

  const valueMatch = this.extractValue(normalized);

  if (!valueMatch) {
    return null;
  }

  const testName = normalized
    .slice(0, valueMatch.index)
    .trim();

  if (!this.looksLikeTestName(testName)) {
    return null;
  }

  /*
   * Avoid accidentally treating ordinary sentences
   * containing numbers as laboratory tests.
   */
  if (this.looksLikeSentence(testName)) {
    return null;
  }

  const fallback = this.findReferenceRange(testName);

  let status = "unknown";
  let referenceRange = null;

  if (fallback) {
    status = this.determineStatus(
      valueMatch.value,
      fallback,
      valueMatch.unit
    );

    referenceRange =
      this.formatFallbackRange(fallback);
  }

  return {
    test: this.normalizeTestName(testName),
    value: valueMatch.value,
    unit: valueMatch.unit || null,
    referenceRange,
    status,
    source: fallback ? "fallback" : "unknown",
  };
}

static looksLikeSentence(text) {
  const normalized = text.toLowerCase().trim();

  const sentenceIndicators = [
    "the ",
    "this ",
    "that ",
    "which ",
    "shows ",
    "demonstrates ",
    "may be ",
    "consistent with",
    "clinical ",
    "patient ",
    "report ",
    "correlation ",
    "testing ",
    "consider ",
    "recommended ",
  ];

  return sentenceIndicators.some((indicator) =>
    normalized.startsWith(indicator)
  );
}
  /**
   * Handle qualitative rows such as:
   *
   * Protein Negative Negative Normal
   * Glucose Negative Negative Normal
   * Appearance Clear Clear Normal
   */
  static parseQualitativeRow(line) {
    const tokens = line.split(/\s+/);

    if (tokens.length < 3) {
      return null;
    }

    const statuses = [
      "normal",
      "low",
      "high",
      "abnormal",
      "slightly high",
      "low / abnormal",
      "high / abnormal",
      "slightly high / abnormal",
    ];

    const lastWords = tokens.slice(-3).join(" ").toLowerCase();

    let status = null;

    for (const possibleStatus of statuses) {
      if (lastWords.includes(possibleStatus)) {
        status = possibleStatus;
        break;
      }
    }

    if (!status) {
      return null;
    }

    // Remove status from the line.
    let content = line;

    const statusIndex = line.toLowerCase().lastIndexOf(status);

    if (statusIndex !== -1) {
      content = line.slice(0, statusIndex).trim();
    }

    /*
     * Common qualitative format:
     *
     * Protein Negative Negative
     *
     * Test = Protein
     * Value = Negative
     * Reference = Negative
     */
    const qualitativeMatch = content.match(
      /^(.+?)\s+(Negative|Positive|Clear|Cloudy|Trace|Present|Absent)\s+(.+)$/i
    );

    if (!qualitativeMatch) {
      return null;
    }

    const testName = qualitativeMatch[1].trim();
    const value = qualitativeMatch[2].trim();
    const referenceRange = qualitativeMatch[3].trim();

    if (!this.looksLikeTestName(testName)) {
      return null;
    }

    return {
      test: this.normalizeTestName(testName),
      value,
      unit: null,
      referenceRange,
      status,
      source: "report",
    };
  }

  /**
   * Extract numeric value and unit.
   *
   * Examples:
   *
   * 10.8 g/dL
   * 33.2%
   * 7,800 /µL
   * 105 mL/min/1.73m²
   */
  static extractValue(text) {
  if (!text) {
    return null;
  }

  const match = text.match(
    /(-?\d+(?:,\d{3})*(?:\.\d+)?)\s*([a-zA-Zµμ/%][a-zA-Zµμ/%0-9.^²³/²-]*)?/
  );

  if (!match) {
    return null;
  }

  return {
    value: Number(match[1].replace(/,/g, "")),
    unit: this.normalizeUnit(match[2] || null),
    index: match.index,
  };
}

static normalizeUnit(unit) {
  if (!unit) {
    return null;
  }

  const normalized = unit
    .trim()
    .replace(/μ/g, "µ");

  const aliases = {
    "mg/dl": "mg/dL",
    "g/dl": "g/dL",
    "ng/ml": "ng/mL",
    "ug/dl": "µg/dL",
    "mcg/dl": "µg/dL",
    "miu/l": "mIU/L",
    "iu/l": "IU/L",
    "u/l": "U/L",
    "fl": "fL",
    "pg": "pg",
    "/ul": "/µL",
    "/µl": "/µL",
    "thousand/ul": "thousand/µL",
    "thousand/µl": "thousand/µL",
  };

  const key = normalized.toLowerCase();

  return aliases[key] || normalized;
}

  /**
   * Extract unit from a text fragment.
   */
  static extractUnit(text) {
    const match = text.match(
      /-?\d+(?:,\d{3})*(?:\.\d+)?\s*([a-zA-Zµμ/%][a-zA-Zµμ/%0-9.^²³/²-]*)/
    );

    return match ? match[1] : null;
  }

  /**
   * Extract report status.
   */
  static extractStatus(text) {
    const normalized = text.toLowerCase();

    if (
  normalized.includes("slightly high") ||
  normalized.includes("slightly-high")
) {
  return "high";
}

    if (
      normalized.includes("low / abnormal") ||
      normalized.includes("low/abnormal")
    ) {
      return "low";
    }

    if (
      normalized.includes("high / abnormal") ||
      normalized.includes("high/abnormal")
    ) {
      return "high";
    }

    if (normalized.includes("abnormal")) {
      return "abnormal";
    }

    if (/\bhigh\b/.test(normalized)) {
      return "high";
    }

    if (/\blow\b/.test(normalized)) {
      return "low";
    }

    if (/\bnormal\b/.test(normalized)) {
      return "normal";
    }

    return null;
  }

  /**
   * Parse:
   *
   * 12.0–15.5 g/dL
   * 0.4–4.0 mIU/L
   * >90
   * <200 mg/dL
   * ≥50 mg/dL
   */
  static parseReferenceRange(range) {
  if (!range) {
    return null;
  }

  const normalized = range
    .replace(/−/g, "-")
    .replace(/–/g, "-")
    .replace(/—/g, "-")
    .trim();

  // Example:
  // 12.0-15.5
  // 3.5-5.0
  const between = normalized.match(
    /(-?\d+(?:,\d{3})?(?:\.\d+)?)\s*-\s*(-?\d+(?:,\d{3})?(?:\.\d+)?)/
  );

  if (between) {
    return {
      type: "between",
      min: Number(between[1].replace(/,/g, "")),
      max: Number(between[2].replace(/,/g, "")),
    };
  }

  // Example:
  // >90
  // ≥50
  const minimum = normalized.match(
    /(?:≥|>)\s*(-?\d+(?:,\d{3})?(?:\.\d+)?)/
  );

  if (minimum) {
    return {
      type: "minimum",
      min: Number(minimum[1].replace(/,/g, "")),
    };
  }

  // Example:
  // <200
  // ≤150
  const maximum = normalized.match(
    /(?:≤|<)\s*(-?\d+(?:,\d{3})?(?:\.\d+)?)/
  );

  if (maximum) {
    return {
      type: "maximum",
      max: Number(maximum[1].replace(/,/g, "")),
    };
  }

  return null;
}

  /**
   * Determine status from numeric result + reference range.
   */
  static determineStatus(value, range, unit = null) {
  if (typeof value !== "number" || !range) {
    return "unknown";
  }

  let normalizedValue = value;

  const normalizedUnit = unit
    ? unit.toLowerCase()
    : "";

  /*
   * Some reports express WBC / platelets in thousands.
   *
   * Example:
   * 7.2 thousand/µL
   *
   * becomes:
   * 7200 /µL
   */
  if (
    normalizedUnit.includes("thousand") &&
    range.max &&
    range.max >= 1000
  ) {
    normalizedValue = value * 1000;
  }

  if (range.type === "between") {
    if (normalizedValue < range.min) {
      return "low";
    }

    if (normalizedValue > range.max) {
      return "high";
    }

    return "normal";
  }

  if (range.type === "minimum") {
    return normalizedValue >= range.min
      ? "normal"
      : "low";
  }

  if (range.type === "maximum") {
    return normalizedValue <= range.max
      ? "normal"
      : "high";
  }

  return "unknown";
}

  /**
   * Find fallback range.
   */
  static findReferenceRange(testName) {
  const normalized = testName
    .toLowerCase()
    .replace(/\|/g, "")
    .replace(/[()]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (this.REFERENCE_RANGES[normalized]) {
    return this.REFERENCE_RANGES[normalized];
  }

  for (const [key, range] of Object.entries(
    this.REFERENCE_RANGES
  )) {
    if (
      normalized.includes(key) ||
      key.includes(normalized)
    ) {
      return range;
    }
  }

  return null;
}

  /**
   * Format fallback range for storage.
   */
  static formatFallbackRange(range) {
    if (!range) {
      return null;
    }

    if (range.max === Infinity) {
      return `≥${range.min} ${range.unit || ""}`.trim();
    }

    return `${range.min}–${range.max} ${range.unit || ""}`.trim();
  }

  /**
   * Normalize test names.
   */
  static normalizeTestName(name) {
  return name
    .replace(/\|/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

  /**
   * Basic protection against interpreting arbitrary prose
   * as a laboratory test.
   */
  static looksLikeTestName(name) {
    if (!name || name.length < 2 || name.length > 100) {
      return false;
    }

    const normalized = name.toLowerCase();

    const blocked = [
      "patient",
      "medical laboratory report",
      "test",
      "result",
      "reference range",
      "status",
      "laboratory impression",
      "this is",
      "the cbc",
      "iron studies show",
      "clinical correlation",
    ];

    if (blocked.some((word) => normalized === word)) {
      return false;
    }

    // Don't treat sentences as test names.
    if (name.split(/\s+/).length > 8) {
      return false;
    }

    return /[a-zA-Z]/.test(name);
  }

  /**
   * Remove duplicate test entries.
   */
  static removeDuplicates(results) {
    const seen = new Map();

    for (const result of results) {
      const key = result.test.toLowerCase();

      if (!seen.has(key)) {
        seen.set(key, result);
      }
    }

    return Array.from(seen.values());
  }
  /**
 * Find abnormal results.
 *
 * Keeps compatibility with MedicalReportController.
 */
static findAbnormalResults(results) {
  if (!Array.isArray(results)) {
    return [];
  }

  return results.filter((result) => {
    if (!result || !result.status) {
      return false;
    }

    const status = String(result.status).toLowerCase().trim();

    return [
      "low",
      "high",
      "abnormal",
      "slightly high",
      "slightly low",
    ].includes(status);
  });
}
}

module.exports = DataParserUtil;