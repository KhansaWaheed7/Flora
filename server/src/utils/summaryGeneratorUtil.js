// server/src/utils/summaryGeneratorUtil.js

class SummaryGeneratorUtil {
  /**
   * Generate simple, easy-to-understand summary with proper formatting
   */
  static generateSummary(reportType, extractedData, abnormalResults) {
    const normalCount = extractedData.filter((d) => d.status === "normal").length;
    const abnormalCount = abnormalResults.length;
    const unknownCount = extractedData.filter((d) => d.status === "unknown").length;
    const totalCount = extractedData.length;

    let summary = "";

    // Title
    summary += `<h3 style="font-size: 1.1rem; font-weight: 600; color: #2F2B2B; margin-bottom: 12px;">Report Summary</h3>`;

    // Opening message based on results
    if (abnormalCount === 0 && totalCount > 0) {
      summary += `<div style="background: #f0fdf4; padding: 12px 16px; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid #22c55e;">`;
      summary += `<span style="font-weight: 600; color: #16a34a;">Great news!</span> `;
      summary += `Your ${reportType.toLowerCase()} results are looking good.`;
      summary += `</div>`;
      
      if (unknownCount > 0) {
        summary += `<div style="background: #fefce8; padding: 12px 16px; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid #eab308;">`;
        summary += `<span style="font-weight: 600; color: #ca8a04;">ℹNote:</span> `;
        summary += `We were able to analyze most of your results, but a few tests couldn't be fully interpreted.`;
        summary += `</div>`;
      }
      
      summary += `<div style="margin-bottom: 8px;">`;
      summary += `<span style="font-weight: 600;">Results Overview:</span> `;
      summary += `We reviewed <strong>${totalCount}</strong> test results, and all of them appear to be within healthy ranges. `;
      summary += `This is positive news, but remember that lab results are just one piece of your overall health picture.`;
      summary += `</div>`;
      
    } else if (abnormalCount > 0) {
      summary += `<div style="background: #fef2f2; padding: 12px 16px; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid #ef4444;">`;
      summary += `<span style="font-weight: 600; color: #dc2626;">Attention Needed</span> `;
      summary += `We've found <strong>${abnormalCount}</strong> result(s) that need your attention.`;
      summary += `</div>`;
      
      summary += `<div style="margin-bottom: 8px;">`;
      summary += `<span style="font-weight: 600;">Results Overview:</span> `;
      summary += `Out of <strong>${totalCount}</strong> tests reviewed, <strong>${normalCount}</strong> were within healthy ranges. `;
      
      if (abnormalCount === 1) {
        summary += `There's 1 value that falls outside the typical range. `;
      } else {
        summary += `There are <strong>${abnormalCount}</strong> values that need to be discussed with your healthcare provider. `;
      }
      summary += `</div>`;
      
      summary += `<div style="background: #fffbeb; padding: 12px 16px; border-radius: 8px; margin-bottom: 8px; border-left: 4px solid #f59e0b;">`;
      summary += `<span style="font-weight: 600; color: #d97706;">Remember:</span> `;
      summary += `Many factors can affect lab results, and sometimes results outside the normal range aren't a cause for concern.`;
      summary += `</div>`;
      
    } else if (totalCount === 0) {
      summary += `<div style="background: #fefce8; padding: 12px 16px; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid #eab308;">`;
      summary += `<span style="font-weight: 600; color: #ca8a04;">No Results Found</span>`;
      summary += `</div>`;
      
      summary += `<div style="margin-bottom: 8px;">`;
      summary += `We couldn't extract any test results from this report. This might happen with certain types of reports or if the text wasn't clear. `;
      summary += `Try uploading a different format or contact our support team for assistance.`;
      summary += `</div>`;
    }

    // Disclaimer with better formatting
    summary += `<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;">`;
    summary += `<div style="background: #fef3f7; padding: 12px 16px; border-radius: 8px; border-left: 4px solid #f33b7d;">`;
    summary += `<span style="font-weight: 600; color: #f33b7d;">Important</span>`;
    summary += `<div style="margin-top: 4px; font-size: 0.9rem; color: #6F6A6B;">`;
    summary += `This analysis is meant to help you understand your results better, but it's not a medical diagnosis. `;
    summary += `Always discuss your results with a qualified healthcare professional who knows your full medical history.`;
    summary += `</div>`;
    summary += `</div>`;

    return summary;
  }

  /**
   * Generate detailed insights with user-friendly language
   */
  static generateInsights(extractedData, abnormalResults, reportType) {
    const normalCount = extractedData.filter((d) => d.status === "normal").length;
    const totalCount = extractedData.length;
    const percentage = totalCount > 0 ? Math.round((normalCount / totalCount) * 100) : 0;

    const insights = {
      overview: this.generateUserFriendlyOverview(extractedData, abnormalResults, percentage),
      keyFindings: this.generateUserFriendlyFindings(abnormalResults, extractedData),
      recommendations: this.generateUserFriendlyRecommendations(abnormalResults, reportType),
      whenToSeeDoctor: this.generateUserFriendlyDoctorAdvice(abnormalResults),
      normalResults: this.generateUserFriendlyNormalResults(extractedData),
      quickSummary: this.generateQuickSummary(abnormalResults, totalCount, percentage),
    };

    return insights;
  }

  /**
   * Generate user-friendly overview
   */
  static generateUserFriendlyOverview(extractedData, abnormalResults, percentage) {
    if (extractedData.length === 0) {
      return "We couldn't find any test results in this report. Don't worry - sometimes reports are formatted in ways that are hard to read. You can try uploading a different version of the report.";
    }

    const abnormalCount = abnormalResults.length;

    if (abnormalCount === 0) {
      return `Based on the ${extractedData.length} tests we analyzed, everything appears to be in a healthy range. This is wonderful news! However, keep in mind that lab results are just one part of your health story. Your doctor considers many factors when evaluating your overall health.`;
    }

    if (abnormalCount <= 2) {
      return `We analyzed ${extractedData.length} tests, and found ${abnormalCount} result(s) that are slightly outside the typical range. Many things can cause temporary fluctuations in lab values - diet, hydration, stress, or even the time of day. It's a good idea to discuss these results with your doctor to get a complete picture.`;
    }

    return `We've analyzed ${extractedData.length} tests and found ${abnormalCount} results that need attention. While this might seem concerning, remember that lab results can be affected by many temporary factors. Your doctor will be able to interpret these results in the context of your overall health and medical history.`;
  }

  /**
   * Generate user-friendly key findings
   */
  static generateUserFriendlyFindings(abnormalResults, extractedData) {
    if (abnormalResults.length === 0) {
      return [
        "All tested values are within healthy ranges",
        "No abnormal results were detected in this report",
        "Your results look great - keep up the good work!"
      ];
    }

    const findings = [];
    
    abnormalResults.slice(0, 5).forEach((result) => {
      const testName = this.capitalizeFirst(result.test);
      let severityText = "";
      
      if (result.severity === "severe") {
        severityText = "This value is significantly outside the normal range and should be discussed with your doctor promptly";
      } else if (result.severity === "moderate") {
        severityText = "This value is outside the normal range and deserves attention";
      } else {
        severityText = "This value is slightly outside the typical range";
      }
      
      findings.push(`${severityText}: ${testName} is ${result.value} ${result.unit} (typical range: ${result.referenceRange})`);
    });

    if (abnormalResults.length > 5) {
      findings.push(`And ${abnormalResults.length - 5} more result(s) that need review`);
    }

    return findings;
  }

  /**
   * Generate user-friendly normal results
   */
  static generateUserFriendlyNormalResults(extractedData) {
    const normalResults = extractedData
      .filter((d) => d.status === "normal")
      .slice(0, 5);

    if (normalResults.length === 0) {
      return ["No normal results to highlight - please discuss all results with your doctor"];
    }

    const messages = [];
    normalResults.forEach((r) => {
      const testName = this.capitalizeFirst(r.test);
      messages.push(`${testName}: ${r.value} ${r.unit} - within healthy range`);
    });

    if (extractedData.filter(d => d.status === "normal").length > 5) {
      messages.push(`And ${extractedData.filter(d => d.status === "normal").length - 5} more results are within healthy ranges`);
    }

    return messages;
  }

  /**
   * Generate user-friendly recommendations
   */
  static generateUserFriendlyRecommendations(abnormalResults, reportType) {
    if (abnormalResults.length === 0) {
      return [
        "Keep up your healthy habits! Regular check-ups are always a good idea.",
        "Schedule your next routine check-up as recommended by your doctor.",
        "Continue with any healthy lifestyle choices you're already making.",
        "Feel free to discuss any health questions with your doctor."
      ];
    }

    const recommendations = [];
    const hasSevere = abnormalResults.some((r) => r.severity === "severe");
    const hasModerate = abnormalResults.some((r) => r.severity === "moderate");

    if (hasSevere) {
      recommendations.push("Schedule an appointment with your doctor as soon as possible - some results need prompt attention");
    } else if (hasModerate) {
      recommendations.push("Book a follow-up appointment with your doctor within the next 1-2 weeks");
    } else {
      recommendations.push("Consider scheduling a routine appointment to discuss these results with your doctor");
    }

    recommendations.push("Bring this report to your doctor's appointment - it will help them understand your results better");
    recommendations.push("Don't stress - many factors can affect lab results, and your doctor can help you understand what's going on");
    
    if (reportType === "Blood Test") {
      recommendations.push("Stay well-hydrated and maintain a balanced diet before future blood tests");
    } else if (reportType === "Gynecology" || reportType === "Ultrasound") {
      recommendations.push("Schedule a follow-up with your gynecologist to discuss these results in detail");
    } else if (reportType === "Cardiology") {
      recommendations.push("Don't ignore heart-related symptoms - discuss any concerns with a cardiologist");
    }

    return recommendations.slice(0, 5);
  }

  /**
   * Generate user-friendly doctor consultation advice
   */
  static generateUserFriendlyDoctorAdvice(abnormalResults) {
    if (abnormalResults.length === 0) {
      return "You can share this report with your doctor during your next routine check-up. Everything looks great!";
    }

    const hasSevere = abnormalResults.some((r) => r.severity === "severe");
    const hasModerate = abnormalResults.some((r) => r.severity === "moderate");

    if (hasSevere) {
      return "Some results are significantly outside the normal range. Please contact your healthcare provider promptly. Don't wait - getting professional medical advice is important when results are this far from the typical range.";
    }

    if (hasModerate) {
      return "It's a good idea to schedule an appointment with your doctor within the next week or two to discuss these results. While nothing appears urgent, it's better to understand what these results mean for you.";
    }

    return "Consider talking to your doctor about these results to get their professional perspective. Even slight variations from the normal range can be completely normal for you personally.";
  }

  /**
   * Generate a quick summary for the report card
   */
  static generateQuickSummary(abnormalResults, totalCount, percentage) {
    if (totalCount === 0) return "No results extracted from this report";

    if (abnormalResults.length === 0) {
      return `All ${totalCount} results look good!`;
    }

    const abnormalCount = abnormalResults.length;
    const normalCount = totalCount - abnormalCount;
    
    if (normalCount === 0) {
      return `All ${totalCount} results need review`;
    }

    return `${abnormalCount} result(s) need attention, ${normalCount} look good`;
  }

  /**
   * Helper function to capitalize first letter
   */
  static capitalizeFirst(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}

module.exports = SummaryGeneratorUtil;