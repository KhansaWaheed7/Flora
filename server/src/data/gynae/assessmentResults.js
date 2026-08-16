const getAssessmentResult = (category, riskLevel, redFlags, answers) => {
  const results = {
    missed_period: {
      title: "Missed or Irregular Period Assessment",
      low:
        "Your answers do not currently indicate any major warning signs. Missed or irregular periods can have several possible causes, including stress, lifestyle changes, or hormonal changes.",
      high:
        "Your answers indicate symptoms that should be evaluated by a healthcare professional, particularly because warning signs were identified.",
    },

    pelvic_pain: {
      title: "Pelvic Pain Assessment",
      low:
        "Your answers do not currently indicate any major warning signs.",
      high:
        "Your answers indicate symptoms that should be evaluated by a healthcare professional.",
    },

    vaginal_discharge: {
      title: "Vaginal Discharge Assessment",
      low:
        "Your answers do not currently indicate any major warning signs.",
      high:
        "Your answers indicate symptoms that should be evaluated by a healthcare professional.",
    },

    painful_period: {
      title: "Painful Period Assessment",
      low:
        "Your answers do not currently indicate any major warning signs.",
      high:
        "Your answers indicate symptoms that should be evaluated by a healthcare professional.",
    },

    abnormal_bleeding: {
      title: "Abnormal Bleeding Assessment",
      low:
        "Your answers do not currently indicate any major warning signs.",
      high:
        "Your answers indicate symptoms that should be evaluated by a healthcare professional.",
    },

    urinary_symptoms: {
      title: "Urinary Symptoms Assessment",
      low:
        "Your answers do not currently indicate any major warning signs.",
      high:
        "Your answers indicate symptoms that should be evaluated by a healthcare professional.",
    },
  };

  const categoryResult = results[category];

  if (!categoryResult) {
    return {
      title: "Gynecological Health Assessment",
      summary:
        riskLevel === "high"
          ? "Your answers indicate symptoms that should be evaluated by a healthcare professional."
          : "Your answers do not currently indicate any major warning signs.",
      recommendation:
        riskLevel === "high"
          ? "Please consider seeking medical evaluation."
          : "If your symptoms continue, worsen, or concern you, consider speaking with a healthcare professional.",
    };
  }

  return {
    title: categoryResult.title,

    summary:
      categoryResult[riskLevel] ||
      categoryResult.low,

    recommendation:
      riskLevel === "high"
        ? "Please seek medical evaluation, especially if your symptoms are severe, worsening, or persistent."
        : "Continue monitoring your symptoms. If they continue, worsen, or concern you, consider speaking with a healthcare professional.",
  };
};

module.exports = {
  getAssessmentResult,
};