const QUESTION_LABELS = {
  // Missed period
  days_late: "Period delay",
  previous_irregular: "Previous period irregularity",
  pregnancy_possibility: "Pregnancy possibility",
  stress_or_lifestyle_change:
    "Recent stress or lifestyle changes",
  pcos_symptoms: "Recent symptoms",
  severe_pain: "Pelvic or abdominal pain",
  heavy_bleeding: "Bleeding",
  dizziness_or_fainting:
    "Dizziness, fainting, or unusual weakness",
  breastfeeding: "Breastfeeding",
  medication_or_contraception:
    "Hormonal medication or contraception",

  // Pelvic pain
  pain_location: "Pain location",
  pain_severity: "Pain severity",
  pain_duration: "Pain duration",
  fever: "Fever or chills",
  fainting: "Fainting or severe dizziness",

  // Vaginal discharge
  discharge_color: "Discharge color",
  discharge_consistency: "Discharge consistency",
  unusual_odor: "Unusual discharge odor",
  itching: "Itching or irritation",
  pain: "Pelvic pain or pain during urination",

  // Painful period
  usual_pattern: "Usual pain pattern",
  daily_activities: "Effect on daily activities",

  // Abnormal bleeding
  bleeding_duration: "Bleeding duration",
  between_periods: "Bleeding between periods",
  after_sex: "Bleeding after sexual activity",
  dizziness: "Dizziness or weakness",

  // Urinary
  burning: "Burning when urinating",
  frequency: "Urination frequency",
  urgency: "Urinary urgency",
  blood_in_urine: "Blood in urine",
  back_or_side_pain: "Back or side pain",

  // Pregnancy
  period_status: "Current period status",
  pregnancy_symptoms: "Possible pregnancy symptoms",
  pelvic_pain: "Pelvic or abdominal pain",
  bleeding: "Vaginal bleeding",
};

const formatValue = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) =>
        String(item)
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) =>
            char.toUpperCase()
          )
      )
      .join(", ");
  }

  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
};

const generateAssessmentSummary = (
  category,
  answers
) => {
  const answerEntries = Object.entries(answers || {});

  if (answerEntries.length === 0) {
    return "No assessment information was provided.";
  }

  const categoryName = String(category)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );

  const details = answerEntries.map(
    ([questionId, answer]) => {
      const label =
        QUESTION_LABELS[questionId] ||
        questionId
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) =>
            char.toUpperCase()
          );

      return `${label}: ${formatValue(answer)}`;
    }
  );

  return (
    `This assessment reviewed your ${categoryName.toLowerCase()} concerns. ` +
    `Your responses were:\n` +
    details
      .map((detail) => `• ${detail}`)
      .join("\n")
  );
};

module.exports = {
  generateAssessmentSummary,
};