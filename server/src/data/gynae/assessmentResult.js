const getAssessmentResult = (
  category,
  riskLevel,
  redFlags = [],
  answers = {}
) => {
  const results = {
    missed_period: {
      title: "Missed or Irregular Period Assessment",

      low:
        "Your answers do not currently indicate any major warning signs. Missed or irregular periods can have several possible causes, including stress, lifestyle changes, or hormonal changes.",

      medium:
        "Your answers suggest that some factors may be contributing to your delayed or irregular period. Monitoring the pattern and discussing persistent or repeated changes with a healthcare professional may be helpful.",

      high:
        "Your answers indicate symptoms that should be evaluated by a healthcare professional, particularly because warning signs were identified.",
    },

    pelvic_pain: {
      title: "Pelvic Pain Assessment",

      low:
        "Your answers do not currently indicate any major warning signs.",

      medium:
        "Your answers suggest that your pelvic pain may benefit from further monitoring or professional evaluation, especially if it persists or changes.",

      high:
        "Your answers indicate symptoms that should be evaluated by a healthcare professional.",
    },

    vaginal_discharge: {
      title: "Vaginal Discharge Assessment",

      low:
        "Your answers do not currently indicate any major warning signs.",

      medium:
        "Some of the discharge characteristics or associated symptoms you reported may be worth discussing with a healthcare professional if they persist or worsen.",

      high:
        "Your answers indicate symptoms that should be evaluated by a healthcare professional.",
    },

    painful_period: {
      title: "Painful Period Assessment",

      low:
        "Your answers do not currently indicate any major warning signs.",

      medium:
        "Your period pain may be affecting you enough to deserve monitoring and discussion with a healthcare professional if it continues or interferes with your daily life.",

      high:
        "Your answers indicate symptoms that should be evaluated by a healthcare professional.",
    },

    abnormal_bleeding: {
      title: "Abnormal Bleeding Assessment",

      low:
        "Your answers do not currently indicate any major warning signs.",

      medium:
        "Your bleeding pattern may be worth monitoring and discussing with a healthcare professional, particularly if it continues or becomes more frequent.",

      high:
        "Your answers indicate symptoms that should be evaluated by a healthcare professional.",
    },

    urinary_symptoms: {
      title: "Urinary Symptoms Assessment",

      low:
        "Your answers do not currently indicate any major warning signs.",

      medium:
        "Your urinary symptoms may be worth discussing with a healthcare professional if they persist, become more frequent, or worsen.",

      high:
        "Your answers indicate symptoms that should be evaluated by a healthcare professional.",
    },

    pregnancy_concern: {
      title: "Pregnancy Concern Assessment",

      low:
        "Your answers do not currently indicate any major warning signs.",

      medium:
        "Your answers indicate that pregnancy may need to be considered. If pregnancy is possible, a pregnancy test and appropriate healthcare advice may help clarify the situation.",

      high:
        "Your answers indicate symptoms that require prompt medical evaluation, particularly because warning signs were identified.",
    },
  };

  const categoryResult = results[category];

  if (!categoryResult) {
    return {
      title: "Gynecological Health Assessment",

      summary:
        riskLevel === "high"
          ? "Your answers indicate symptoms that should be evaluated by a healthcare professional."
          : riskLevel === "medium"
          ? "Your answers suggest that further monitoring or professional evaluation may be helpful."
          : "Your answers do not currently indicate any major warning signs.",

      recommendation:
        riskLevel === "high"
          ? "Please seek medical evaluation, especially if your symptoms are severe, worsening, or persistent."
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
        : riskLevel === "medium"
        ? "Monitor your symptoms and consider speaking with a healthcare professional if they persist, worsen, or concern you."
        : "Continue monitoring your symptoms. If they continue, worsen, or concern you, consider speaking with a healthcare professional.",
  };
};

module.exports = {
  getAssessmentResult,
};