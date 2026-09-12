const medicalReferences = require("../knowledge/medicalReferences");

class MedicalRAGUtil {
  /**
   * Normalize text for matching.
   */
  static normalize(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[()[\],.:]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /**
   * Calculate simple lexical similarity.
   *
   * This is intentionally lightweight for Flora's first
   * production version. It allows us to retrieve relevant
   * medical knowledge without requiring a separate vector
   * database.
   */
  static similarity(testName, reference) {
    const query = this.normalize(testName);

    const candidates = [
      reference.test,
      ...(reference.aliases || []),
    ].map(this.normalize);

    let bestScore = 0;

    for (const candidate of candidates) {
      if (query === candidate) {
        bestScore = Math.max(bestScore, 1);
        continue;
      }

      if (query.includes(candidate) || candidate.includes(query)) {
        bestScore = Math.max(bestScore, 0.9);
        continue;
      }

      const queryWords = new Set(query.split(" "));
      const candidateWords = new Set(candidate.split(" "));

      const intersection = [...queryWords].filter((word) =>
        candidateWords.has(word)
      );

      const union = new Set([...queryWords, ...candidateWords]);

      if (union.size > 0) {
        const score = intersection.length / union.size;
        bestScore = Math.max(bestScore, score);
      }
    }

    return bestScore;
  }

  /**
   * Retrieve the most relevant medical references.
   */
  static retrieve(testName, topK = 3) {
    if (!testName) {
      return [];
    }

    return medicalReferences
      .map((reference) => ({
        ...reference,
        score: this.similarity(testName, reference),
      }))
      .filter((reference) => reference.score >= 0.35)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  /**
   * Build context that can be supplied to Gemini.
   */
  /**
 * Build context that can be supplied to Gemini.
 */
static buildContext(tests) {
  if (!Array.isArray(tests) || tests.length === 0) {
    return "No medical reference information was retrieved.";
  }

  const sections = [];

  for (const test of tests) {
    const matches = this.retrieve(test.test);

    if (matches.length === 0) {
      sections.push(
        [
          `TEST: ${test.test}`,
          "No matching medical reference was found.",
          "KNOWLEDGE REFERENCE RANGE: unavailable",
          "REFERENCE SOURCE: none",
        ].join("\n")
      );
      continue;
    }

    const best = matches[0];

    sections.push(
      [
        `TEST: ${test.test}`,
        `MATCHED REFERENCE: ${best.test}`,
        `CATEGORY: ${best.category || "Unknown"}`,
        `KNOWLEDGE REFERENCE RANGE: ${
          best.referenceRange || "unavailable"
        }`,
        `REFERENCE SOURCE: knowledge_base`,
        `INFORMATION: ${best.information || ""}`,
        `MATCH SCORE: ${best.score.toFixed(2)}`,
      ].join("\n")
    );
  }

  return sections.join("\n\n");
}
}

module.exports = MedicalRAGUtil;