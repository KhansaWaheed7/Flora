const { GYNAE_CATEGORIES } = require("./categories");

const QUESTION_FLOWS = {
  // ======================================================
  // MISSED / IRREGULAR PERIOD
  // ======================================================

  [GYNAE_CATEGORIES.MISSED_PERIOD]: [
    {
      id: "days_late",
      question: "How late is your period?",
      type: "single_choice",
      options: [
        { value: "1_3", label: "1–3 days" },
        { value: "4_7", label: "4–7 days" },
        { value: "8_14", label: "8–14 days" },
        { value: "15_30", label: "15–30 days" },
        { value: "more_than_30", label: "More than 30 days" },
        { value: "not_sure", label: "I'm not sure" },
      ],
      required: true,
    },

    {
      id: "previous_irregular",
      question: "How often have your periods been irregular in the past?",
      type: "single_choice",
      options: [
        { value: "never", label: "Never" },
        { value: "rarely", label: "Rarely" },
        { value: "sometimes", label: "Sometimes" },
        { value: "often", label: "Often" },
        { value: "almost_always", label: "Almost always" },
      ],
      required: true,
    },

    {
      id: "pregnancy_possibility",
      question:
        "Is there any possibility that you could be pregnant?",
      type: "single_choice",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "not_sure", label: "I'm not sure" },
        { value: "prefer_not_to_say", label: "Prefer not to say" },
      ],
      required: true,
    },

    {
      id: "stress_or_lifestyle_change",
      question:
        "Have you recently experienced significant stress or changes in your lifestyle?",
      type: "single_choice",
      options: [
        { value: "none", label: "No significant changes" },
        { value: "mild", label: "Mild changes" },
        { value: "moderate", label: "Moderate changes" },
        { value: "significant", label: "Significant changes" },
      ],
      required: true,
    },

    {
      id: "pcos_symptoms",
      question:
        "Which of these symptoms have you noticed recently?",
      type: "multi_choice",
      options: [
        {
          value: "acne",
          label: "Persistent acne",
        },
        {
          value: "facial_body_hair",
          label: "Increased facial or body hair",
        },
        {
          value: "weight_changes",
          label: "Unusual weight changes",
        },
        {
          value: "hair_thinning",
          label: "Hair thinning",
        },
        {
          value: "none",
          label: "None of these",
        },
      ],
      required: true,
    },

    {
      id: "severe_pain",
      question:
        "How would you describe any lower abdominal or pelvic pain?",
      type: "single_choice",
      options: [
        { value: "none", label: "No pain" },
        { value: "mild", label: "Mild" },
        { value: "moderate", label: "Moderate" },
        { value: "severe", label: "Severe" },
        { value: "very_severe", label: "Very severe" },
      ],
      required: true,
    },

    {
  id: "heavy_bleeding",
  question:
    "How would you describe your current vaginal bleeding?",
  type: "single_choice",
  options: [
    { value: "none", label: "No unusual bleeding" },
    { value: "light", label: "Light" },
    { value: "moderate", label: "Moderate" },
    { value: "heavy", label: "Heavy" },
    { value: "very_heavy", label: "Very heavy" },
  ],
  required: true,
},

{
  id: "dizziness_or_fainting",
  question:
    "Have you experienced severe dizziness, fainting, or unusual weakness?",
  type: "single_choice",
  options: [
    { value: "no", label: "No" },
    { value: "sometimes", label: "Sometimes" },
    { value: "yes", label: "Yes" },
    { value: "not_sure", label: "I'm not sure" },
  ],
  required: true,
},

{
  id: "breastfeeding",
  question:
    "Are you currently breastfeeding?",
  type: "single_choice",
  options: [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
    { value: "not_sure", label: "I'm not sure" },
    { value: "prefer_not_to_say", label: "Prefer not to say" },
  ],
  required: true,
},

{
  id: "medication_or_contraception",
  question:
    "Have you recently started, stopped, or changed any hormonal medication or contraception?",
  type: "single_choice",
  options: [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
    { value: "not_sure", label: "I'm not sure" },
    { value: "prefer_not_to_say", label: "Prefer not to say" },
  ],
  required: true,
},
  ],


  // PELVIC PAIN

  [GYNAE_CATEGORIES.PELVIC_PAIN]: [
    {
      id: "pain_location",
      question: "Where are you experiencing the pain?",
      type: "single_choice",
      options: [
        { value: "lower_abdomen", label: "Lower abdomen" },
        { value: "pelvis", label: "Pelvic area" },
        { value: "one_side", label: "Mostly on one side" },
        { value: "lower_back", label: "Lower back" },
        { value: "multiple_areas", label: "Multiple areas" },
        { value: "other", label: "Other" },
      ],
      required: true,
    },

    {
      id: "pain_severity",
      question: "How severe is the pain?",
      type: "single_choice",
      options: [
        { value: "none", label: "No pain" },
        { value: "mild", label: "Mild" },
        { value: "moderate", label: "Moderate" },
        { value: "severe", label: "Severe" },
        { value: "very_severe", label: "Very severe" },
      ],
      required: true,
    },

    {
      id: "pain_duration",
      question: "How long have you been experiencing the pain?",
      type: "single_choice",
      options: [
        { value: "less_than_24h", label: "Less than 24 hours" },
        { value: "1_3_days", label: "1–3 days" },
        { value: "4_7_days", label: "4–7 days" },
        { value: "more_than_week", label: "More than a week" },
        { value: "recurring", label: "It keeps coming back" },
      ],
      required: true,
    },

    {
      id: "fever",
      question: "Are you experiencing fever or chills?",
      type: "single_choice",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "not_sure", label: "I'm not sure" },
      ],
      required: true,
    },

    {
      id: "heavy_bleeding",
      question: "Are you experiencing unusual or heavy bleeding?",
      type: "single_choice",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "not_sure", label: "I'm not sure" },
      ],
      required: true,
    },

    {
      id: "fainting",
      question:
        "Have you experienced fainting, severe dizziness, or unusual weakness?",
      type: "single_choice",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "sometimes", label: "Sometimes" },
      ],
      required: true,
    },

    {
      id: "pregnancy_possibility",
      question:
        "Is there any possibility that you could be pregnant?",
      type: "single_choice",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "not_sure", label: "I'm not sure" },
        { value: "prefer_not_to_say", label: "Prefer not to say" },
      ],
      required: true,
    },
  ],


  // VAGINAL DISCHARGE

  [GYNAE_CATEGORIES.VAGINAL_DISCHARGE]: [
    {
      id: "discharge_color",
      question: "What color is the discharge?",
      type: "single_choice",
      options: [
        { value: "clear", label: "Clear" },
        { value: "white", label: "White" },
        { value: "yellow", label: "Yellow" },
        { value: "green", label: "Green" },
        { value: "grey", label: "Grey" },
        { value: "brown", label: "Brown" },
        { value: "other", label: "Other" },
      ],
      required: true,
    },

    {
      id: "discharge_consistency",
      question: "How would you describe the consistency?",
      type: "single_choice",
      options: [
        { value: "thin", label: "Thin / watery" },
        { value: "creamy", label: "Creamy" },
        { value: "thick", label: "Thick" },
        { value: "lumpy", label: "Lumpy / cottage-cheese-like" },
        { value: "other", label: "Other" },
      ],
      required: true,
    },

    {
      id: "unusual_odor",
      question: "Does the discharge have an unusual or strong odor?",
      type: "single_choice",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "not_sure", label: "I'm not sure" },
      ],
      required: true,
    },

    {
      id: "itching",
      question: "Are you experiencing itching or irritation?",
      type: "single_choice",
      options: [
        { value: "none", label: "No" },
        { value: "mild", label: "Mild" },
        { value: "moderate", label: "Moderate" },
        { value: "severe", label: "Severe" },
      ],
      required: true,
    },

    {
      id: "pain",
      question:
        "Are you experiencing pelvic pain or pain during urination?",
      type: "single_choice",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "not_sure", label: "I'm not sure" },
      ],
      required: true,
    },

    {
      id: "fever",
      question: "Are you experiencing fever or chills?",
      type: "single_choice",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "not_sure", label: "I'm not sure" },
      ],
      required: true,
    },

    {
      id: "pregnancy_possibility",
      question:
        "Is there any possibility that you could be pregnant?",
      type: "single_choice",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "not_sure", label: "I'm not sure" },
        { value: "prefer_not_to_say", label: "Prefer not to say" },
      ],
      required: true,
    },
  ],

 
  // PAINFUL PERIOD
  
  [GYNAE_CATEGORIES.PAINFUL_PERIOD]: [
    {
      id: "pain_severity",
      question: "How severe is your period pain?",
      type: "single_choice",
      options: [
        { value: "mild", label: "Mild" },
        { value: "moderate", label: "Moderate" },
        { value: "severe", label: "Severe" },
        { value: "very_severe", label: "Very severe" },
      ],
      required: true,
    },

    {
      id: "pain_duration",
      question: "How long does the pain usually last?",
      type: "single_choice",
      options: [
        { value: "less_than_day", label: "Less than a day" },
        { value: "1_2_days", label: "1–2 days" },
        { value: "3_4_days", label: "3–4 days" },
        { value: "more_than_4_days", label: "More than 4 days" },
      ],
      required: true,
    },

    {
      id: "usual_pattern",
      question:
        "Is this pain similar to what you normally experience during your periods?",
      type: "single_choice",
      options: [
        { value: "yes", label: "Yes, it is usual for me" },
        { value: "somewhat", label: "It is somewhat different" },
        { value: "no", label: "No, it is very different" },
      ],
      required: true,
    },

    {
      id: "heavy_bleeding",
      question:
        "How would you describe your menstrual bleeding?",
      type: "single_choice",
      options: [
        { value: "normal", label: "Normal for me" },
        { value: "somewhat_heavy", label: "Somewhat heavier than usual" },
        { value: "heavy", label: "Heavy" },
        { value: "very_heavy", label: "Very heavy" },
      ],
      required: true,
    },

    {
      id: "fainting",
      question:
        "Have you experienced fainting or severe dizziness during your period?",
      type: "single_choice",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "sometimes", label: "Sometimes" },
      ],
      required: true,
    },

    {
      id: "daily_activities",
      question:
        "How much does the pain affect your normal daily activities?",
      type: "single_choice",
      options: [
        { value: "not_at_all", label: "Not at all" },
        { value: "slightly", label: "Slightly" },
        { value: "moderately", label: "Moderately" },
        { value: "significantly", label: "Significantly" },
        { value: "completely", label: "I cannot do my normal activities" },
      ],
      required: true,
    },
  ],

 
  // ABNORMAL BLEEDING
  

  [GYNAE_CATEGORIES.ABNORMAL_BLEEDING]: [
    {
      id: "bleeding_duration",
      question: "How long have you been experiencing the unusual bleeding?",
      type: "single_choice",
      options: [
        { value: "less_than_day", label: "Less than a day" },
        { value: "1_3_days", label: "1–3 days" },
        { value: "4_7_days", label: "4–7 days" },
        { value: "more_than_week", label: "More than a week" },
        { value: "recurring", label: "It keeps coming back" },
      ],
      required: true,
    },

    {
      id: "heavy_bleeding",
      question: "How heavy is the bleeding?",
      type: "single_choice",
      options: [
        { value: "light", label: "Light" },
        { value: "moderate", label: "Moderate" },
        { value: "heavy", label: "Heavy" },
        { value: "very_heavy", label: "Very heavy" },
      ],
      required: true,
    },

    {
      id: "between_periods",
      question:
        "Is the bleeding happening between your normal periods?",
      type: "single_choice",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "not_sure", label: "I'm not sure" },
      ],
      required: true,
    },

    {
      id: "after_sex",
      question:
        "Does the bleeding occur after sexual activity?",
      type: "single_choice",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "sometimes", label: "Sometimes" },
        { value: "not_applicable", label: "Not applicable" },
      ],
      required: true,
    },

    {
      id: "severe_pain",
      question:
        "How would you describe any pelvic or abdominal pain?",
      type: "single_choice",
      options: [
        { value: "none", label: "No pain" },
        { value: "mild", label: "Mild" },
        { value: "moderate", label: "Moderate" },
        { value: "severe", label: "Severe" },
        { value: "very_severe", label: "Very severe" },
      ],
      required: true,
    },

    {
      id: "dizziness",
      question:
        "Are you experiencing severe dizziness, fainting, or unusual weakness?",
      type: "single_choice",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "sometimes", label: "Sometimes" },
      ],
      required: true,
    },

    {
      id: "pregnancy_possibility",
      question:
        "Is there any possibility that you could be pregnant?",
      type: "single_choice",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "not_sure", label: "I'm not sure" },
        { value: "prefer_not_to_say", label: "Prefer not to say" },
      ],
      required: true,
    },
  ],

  // ======================================================
  // URINARY SYMPTOMS
  // ======================================================

  [GYNAE_CATEGORIES.URINARY_SYMPTOMS]: [
    {
      id: "burning",
      question:
        "How often do you experience burning or pain when urinating?",
      type: "single_choice",
      options: [
        { value: "never", label: "Never" },
        { value: "occasionally", label: "Occasionally" },
        { value: "sometimes", label: "Sometimes" },
        { value: "often", label: "Often" },
      ],
      required: true,
    },

    {
      id: "frequency",
      question:
        "How often are you urinating more frequently than usual?",
      type: "single_choice",
      options: [
        { value: "never", label: "Never" },
        { value: "occasionally", label: "Occasionally" },
        { value: "sometimes", label: "Sometimes" },
        { value: "often", label: "Often" },
      ],
      required: true,
    },

    {
      id: "urgency",
      question:
        "How often do you experience a sudden or urgent need to urinate?",
      type: "single_choice",
      options: [
        { value: "never", label: "Never" },
        { value: "occasionally", label: "Occasionally" },
        { value: "sometimes", label: "Sometimes" },
        { value: "often", label: "Often" },
      ],
      required: true,
    },

    {
      id: "blood_in_urine",
      question:
        "Have you noticed blood in your urine?",
      type: "single_choice",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "not_sure", label: "I'm not sure" },
      ],
      required: true,
    },

    {
      id: "fever",
      question: "Are you experiencing fever or chills?",
      type: "single_choice",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "not_sure", label: "I'm not sure" },
      ],
      required: true,
    },

    {
      id: "back_or_side_pain",
      question:
        "Are you experiencing significant pain in your back or side?",
      type: "single_choice",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "not_sure", label: "I'm not sure" },
      ],
      required: true,
    },

    {
      id: "pregnancy_possibility",
      question:
        "Is there any possibility that you could be pregnant?",
      type: "single_choice",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "not_sure", label: "I'm not sure" },
        { value: "prefer_not_to_say", label: "Prefer not to say" },
      ],
      required: true,
    },
  ],
};

module.exports = {
  QUESTION_FLOWS,
};