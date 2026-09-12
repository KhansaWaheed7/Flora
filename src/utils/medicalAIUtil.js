const { GoogleGenAI } = require("@google/genai");
const MedicalRAGUtil = require("./medicalRAGUtil");

class MedicalAIUtil {
  static getClient() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    return new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  /**
   * Analyze extracted medical report text using Gemini + RAG.
   */
  static async analyzeReport(extractedText) {
    if (!extractedText || !extractedText.trim()) {
      throw new Error("No medical report text available for AI analysis");
    }

    const ai = this.getClient();

    // =========================================================
    // STEP 1: Extract actual tests from the uploaded report
    // =========================================================

    const extractionPrompt = `
You are Flora's medical report extraction engine.

Analyze the medical report below.

Extract EVERY actual medical or laboratory test/result.

IMPORTANT RULES:

1. Include every actual medical test/result.
2. Do not require a predefined test dictionary.
3. Preserve the test name from the report whenever possible.
4. Extract the value exactly as shown.
5. Extract the unit if present.
6. Extract the reference range ONLY if it appears in the uploaded report.
7. Extract the status ONLY when explicitly provided by the report.
8. Do NOT invent reference ranges.
9. Do NOT invent results.
10. Ignore patient IDs, registration numbers, dates, doctor names,
    addresses and administrative metadata.
11. A test without a reference range MUST still be included.
12. Do not interpret the result at this stage.

Return ONLY valid JSON.

FORMAT:

{
  "reportType": "string",
  "tests": [
    {
      "test": "string",
      "value": "string",
      "unit": "string|null",
      "reportReferenceRange": "string|null",
      "status": "normal|low|high|abnormal|unknown"
    }
  ]
}

MEDICAL REPORT:

${extractedText}
`;

    const extractionResponse = await this.generateWithRetry(
  ai,
  extractionPrompt
);

    const extractionRaw = extractionResponse.text;

    if (!extractionRaw) {
      throw new Error("Gemini returned an empty extraction response");
    }

    let extraction;

    try {
      extraction = JSON.parse(extractionRaw);
    } catch (error) {
      console.error("Gemini extraction JSON error:", extractionRaw);
      throw new Error("AI returned invalid extraction format");
    }

    const extractedTests = Array.isArray(extraction.tests)
      ? extraction.tests
      : [];

    // =========================================================
    // STEP 2: Retrieve medical knowledge using RAG
    // =========================================================

    const ragContext = MedicalRAGUtil.buildContext(extractedTests);

    // =========================================================
    // STEP 3: Interpret tests using report + RAG
    // =========================================================

    const analysisPrompt = `
You are Flora's medical report analysis engine.

You have TWO information sources.

SOURCE 1:
The original uploaded medical report.

SOURCE 2:
Retrieved medical reference information from Flora's medical
knowledge base.

Your job is to produce a careful, patient-friendly interpretation.

=========================================================
CRITICAL RULES
=========================================================

1. Preserve EVERY test extracted from the report.

2. Never remove a test because its reference range is unknown.

3. If the uploaded report contains a reference range:
   - Store it as reportReferenceRange.
   - Set referenceSource to "report".
   - Prefer it over knowledge-base information.

4. If the uploaded report does NOT contain a reference range
   but the knowledge base provides a reliable range:
   - Store the knowledge range as knowledgeReferenceRange.
   - Set referenceSource to "knowledge_base".
   - Use that range for interpretation when appropriate.

5. If neither source provides a reliable range:
   - reportReferenceRange = ""
   - knowledgeReferenceRange = ""
   - referenceSource = "none"
   - status = "unknown"

6. NEVER invent a reference range.

7. NEVER invent a medical result.

8. NEVER diagnose a disease.

9. Do not claim certainty when information is insufficient.

10. Consider the unit when interpreting numerical values.

11. Explain abnormal results using simple patient-friendly language.

12. If multiple related tests exist, consider them together.

13. Do not interpret administrative metadata as medical tests.

14. Knowledge-base information is supporting knowledge and must
    never replace a reference range explicitly printed on the report.

=========================================================
REFERENCE RANGE RULE
=========================================================



For each test:

If reportReferenceRange exists:
    referenceSource = "report"

Else if a reliable knowledge range exists:
    referenceSource = "knowledge_base"

Else:
    referenceSource = "none"

=========================================================

REFERENCE RANGE OUTPUT RULES:

- If the original report contains a reference range:
  reportReferenceRange = that exact range
  knowledgeReferenceRange = null
  referenceSource = "report"

- If the original report does not contain a reference range but
  the retrieved knowledge base provides a reliable range:
  reportReferenceRange = null
  knowledgeReferenceRange = retrieved range
  referenceSource = "knowledge_base"

- If neither provides a reliable range:
  reportReferenceRange = null
  knowledgeReferenceRange = null
  referenceSource = "none"

- NEVER copy a knowledge-base range into reportReferenceRange.


STATUS RULE
=========================================================

normal:
    Value is within the applicable reference range.

low:
    Value is below the applicable reference range.

high:
    Value is above the applicable reference range.

abnormal:
    The report explicitly says abnormal but direction cannot
    safely be determined.

unknown:
    There is insufficient information to determine status.

If the uploaded report explicitly provides a status, preserve it
unless it clearly conflicts with the numerical reference range.

=========================================================
CONFIDENCE
=========================================================

Return confidence from 0 to 100.

Higher confidence:
- Clear test name
- Clear value
- Clear unit
- Clear report reference range
- Clear status

Lower confidence:
- OCR uncertainty
- Missing range
- Ambiguous value
- Ambiguous unit
- Unclear test name

=========================================================
OUTPUT
=========================================================

Return ONLY valid JSON.

{
  "reportType": "string",

  "tests": [
    {
  "test": "string",
  "value": "string",
  "unit": "string|null",
  "reportReferenceRange": "string|null",
  "knowledgeReferenceRange": "string|null",
  "referenceSource": "report|knowledge_base|none",
  "status": "normal|low|high|abnormal|unknown",
  "explanation": "string"
}
  ],

  "overview": "string",

  "keyFindings": [
    "string"
  ],

  "recommendations": [
    "string"
  ],

  "whenToSeeDoctor": "string",

  "disclaimer": "string"
}

=========================================================
RETRIEVED MEDICAL KNOWLEDGE
=========================================================

${ragContext}

=========================================================
ORIGINAL MEDICAL REPORT
=========================================================

${extractedText}
`;

    const analysisResponse = await this.generateWithRetry(
  ai,
  analysisPrompt
);

    const rawText = analysisResponse.text;

    if (!rawText) {
      throw new Error("Gemini returned an empty analysis response");
    }

    let parsed;

    try {
      parsed = JSON.parse(rawText);
    } catch (error) {
      console.error("Gemini analysis JSON error:", rawText);
      throw new Error("AI returned invalid analysis format");
    }

    return this.validateAnalysis(parsed);
  }

  /**
   * Validate and normalize AI output.
   */
  static validateAnalysis(data) {
    if (!data || typeof data !== "object") {
      throw new Error("Invalid AI analysis");
    }

    const tests = Array.isArray(data.tests) ? data.tests : [];

    const normalizedTests = tests
      .filter(
        (test) =>
          test &&
          test.test &&
          test.value !== undefined
      )
      .map((test) => ({
        test: String(test.test).trim(),

        value: String(test.value).trim(),

        unit:
          test.unit === null || test.unit === undefined
            ? null
            : String(test.unit).trim(),

        reportReferenceRange:
          test.reportReferenceRange === null ||
          test.reportReferenceRange === undefined
            ? ""
            : String(test.reportReferenceRange).trim(),

        knowledgeReferenceRange:
          test.knowledgeReferenceRange === null ||
          test.knowledgeReferenceRange === undefined
            ? ""
            : String(test.knowledgeReferenceRange).trim(),

        referenceSource: this.normalizeReferenceSource(
          test.referenceSource
        ),

        status: this.normalizeStatus(test.status),

        confidence: this.normalizeConfidence(
          test.confidence
        ),

        explanation:
          test.explanation
            ? String(test.explanation).trim()
            : "",
      }));

    const abnormalTests = normalizedTests.filter((test) =>
      ["low", "high", "abnormal"].includes(test.status)
    );

    const normalTests = normalizedTests.filter(
      (test) => test.status === "normal"
    );

    const unknownTests = normalizedTests.filter(
      (test) => test.status === "unknown"
    );

    return {
  reportType: data.reportType
    ? String(data.reportType).trim()
    : "Unknown",

  tests: normalizedTests,

  abnormalResults: abnormalTests,

  overview: data.overview
    ? String(data.overview).trim()
    : "",

  keyFindings: Array.isArray(data.keyFindings)
    ? data.keyFindings.map(String)
    : [],

  recommendations: Array.isArray(data.recommendations)
    ? data.recommendations.map(String)
    : [],

  whenToSeeDoctor: data.whenToSeeDoctor
    ? String(data.whenToSeeDoctor).trim()
    : "",

  disclaimer: data.disclaimer
    ? String(data.disclaimer).trim()
    : "This analysis is for informational purposes and is not a medical diagnosis.",

  // RAG was used to build the analysis context
  ragUsed: true,

  statistics: {
    total: normalizedTests.length,
    normal: normalizedTests.length -
      abnormalTests.length -
      normalizedTests.filter((test) => test.status === "unknown").length,

    abnormal: abnormalTests.length,

    unknown: normalizedTests.filter(
      (test) => test.status === "unknown"
    ).length,
  },
};
  }

  /**
   * Normalize reference source.
   */
  static normalizeReferenceSource(source) {
    if (!source) {
      return "none";
    }

    const normalized = String(source)
      .toLowerCase()
      .trim();

    if (
      [
        "report",
        "knowledge_base",
        "none",
      ].includes(normalized)
    ) {
      return normalized;
    }

    return "none";
  }

  /**
   * Normalize confidence.
   */
  static normalizeConfidence(confidence) {
    const number = Number(confidence);

    if (Number.isNaN(number)) {
      return 0;
    }

    return Math.min(100, Math.max(0, number));
  }

  /**
   * Normalize status.
   */
  static normalizeStatus(status) {
    if (!status) {
      return "unknown";
    }

    const normalized = String(status)
      .toLowerCase()
      .trim();

    if (
      [
        "normal",
        "low",
        "high",
        "abnormal",
        "unknown",
      ].includes(normalized)
    ) {
      return normalized;
    }

    return "unknown";
  }

  static async generateWithRetry(ai, prompt, maxRetries = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
      });
    } catch (error) {
      lastError = error;

      const status = error?.status;
      const code = error?.code;

      const isRetryable =
        status === "UNAVAILABLE" ||
        code === 503 ||
        code === 429 ||
        error?.message?.includes("high demand") ||
        error?.message?.includes("temporarily unavailable");

      if (!isRetryable || attempt === maxRetries) {
        throw error;
      }

      const delay = attempt * 2000;

      console.warn(
        `Gemini temporarily unavailable. Retry ${attempt}/${maxRetries} in ${delay}ms...`
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
}

module.exports = MedicalAIUtil;