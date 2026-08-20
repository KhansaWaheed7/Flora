// server/src/utils/summaryGeneratorUtil.js

class SummaryGeneratorUtil {
  /**
   * Generate simple, easy-to-understand summary
   */
  static generateSummary(reportType, extractedData, abnormalResults) {
    let summary = `**${reportType} Report Summary**\n\n`;

    // Overall statistics
    const normalCount = extractedData.filter((d) => d.status === "normal").length;
    const abnormalCount = abnormalResults.length;
    const unknownCount = extractedData.filter((d) => d.status === "unknown").length;
    const totalCount = extractedData.length;

    summary += `**Test Results**: ${totalCount} tests performed\n`;
    summary += `Normal: ${normalCount} | Abnormal: ${abnormalCount} | Unknown: ${unknownCount}\n\n`;

    // Key findings
    if (abnormalCount === 0) {
  if (unknownCount > 0) {
    summary += `**Analysis**: All analyzed results are within the configured reference ranges. Some results could not be classified.\n\n`;
  } else {
    summary += `**Analysis**: All analyzed results are within the configured reference ranges. This does not rule out health conditions and should not replace professional medical advice.\n\n`;
  }
} else {
      summary += ` **Attention Needed**: ${abnormalCount} result(s) are outside normal ranges.\n\n`;

      summary += `**Abnormal Findings:**\n`;
      abnormalResults.slice(0, 5).forEach((result) => {
        summary += `- ${this.capitalizeFirst(result.test)}: ${result.value} ${result.unit} (Normal: ${result.referenceRange})\n`;
      });
      summary += "\n";
    }

    summary += `**Disclaimer**: This analysis is for informational purposes only. Please consult a healthcare professional for proper interpretation.\n`;

    return summary;
  }

  /**
   * Generate detailed insights
   */
  static generateInsights(extractedData, abnormalResults, reportType) {
    const insights = {
      overview: this.generateOverview(extractedData, abnormalResults),
      keyFindings: this.generateKeyFindings(abnormalResults, extractedData),
      recommendations: this.generateRecommendations(abnormalResults, reportType),
      whenToSeeDoctor: this.generateDoctorAdvice(abnormalResults),
      normalResults: this.generateNormalResults(extractedData),
    };

    return insights;
  }

  /**
   * Generate overview
   */
  static generateOverview(extractedData, abnormalResults) {
    if (extractedData.length === 0) {
      return "No test results were found in the report.";
    }

    const normalCount = extractedData.filter((d) => d.status === "normal").length;
    const percentage = Math.round((normalCount / extractedData.length) * 100);

    if (abnormalResults.length === 0) {
  return `${percentage}% of the analyzed results are within the configured reference ranges. This analysis is informational and does not provide a diagnosis.`;
}

    return `${percentage}% of your test results are within normal ranges. There are ${abnormalResults.length} result(s) that need attention from a healthcare professional.`;
  }

  /**
   * Generate key findings
   */
  static generateKeyFindings(abnormalResults, extractedData) {
    if (abnormalResults.length === 0) {
  return [
    "All analyzed test results are within the configured reference ranges",
  ];
}

    return abnormalResults.slice(0, 5).map((result) => {
      const severity = result.severity.toUpperCase();
      return `[${severity}] ${this.capitalizeFirst(result.test)}: ${result.value} ${result.unit} (Normal: ${result.referenceRange})`;
    });
  }

  /**
   * Generate list of normal results
   */
  static generateNormalResults(extractedData) {
    const normalResults = extractedData
      .filter((d) => d.status === "normal")
      .slice(0, 3);

    if (normalResults.length === 0) return [];

    return normalResults.map(
      (r) => `${this.capitalizeFirst(r.test)}: ${r.value} ${r.unit} `
    );
  }

  /**
   * Generate recommendations
   */
  static generateRecommendations(abnormalResults, reportType) {
    if (abnormalResults.length === 0) {
      return [
  "Continue regular health checkups as recommended by your healthcare professional",
  "Follow any testing schedule recommended by your healthcare professional",
  "Discuss any concerns or symptoms with a qualified healthcare professional",
];
    }

    const recommendations = [
      "Schedule an appointment with your doctor to discuss these results",
      "Do not self-diagnose or self-medicate based on these results",
      "Bring a copy of this report to your medical consultation",
    ];

    // Type-specific recommendations
    if (reportType === "Blood Test") {
      recommendations.push("Stay hydrated and maintain proper nutrition");
      recommendations.push("Avoid strenuous activities before blood tests");
    } else if (reportType === "Gynecology" || reportType === "Ultrasound") {
      recommendations.push("Schedule a follow-up appointment with your gynecologist");
    } else if (reportType === "Thyroid Test") {
      recommendations.push("Discuss thyroid medication options with your endocrinologist");
    } else if (reportType === "Cardiology") {
      recommendations.push("Consult with a cardiologist for proper evaluation");
    }

    return recommendations.slice(0, 4);
  }

  /**
   * Generate doctor consultation advice
   */
  static generateDoctorAdvice(abnormalResults) {
    if (abnormalResults.length === 0) {
      return "You can share this report with your doctor during your next routine checkup.";
    }

    const hasSevere = abnormalResults.some((r) => r.severity === "severe");
    const hasModerate = abnormalResults.some((r) => r.severity === "moderate");

    if (hasSevere) {
  return "**Important**: Some results are substantially outside the configured reference ranges. Please contact a qualified healthcare professional promptly for proper interpretation.";
}

    if (hasModerate) {
      return "**Important**: Schedule an appointment with your doctor within the next week to discuss these results.";
    }

    return "Contact your doctor to discuss these results and determine if any follow-up tests are needed.";
  }

  /**
   * Helper function to capitalize first letter
   */
  static capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}

module.exports = SummaryGeneratorUtil;