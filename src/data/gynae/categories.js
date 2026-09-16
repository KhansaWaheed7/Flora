const GYNAE_CATEGORIES = {
  MISSED_PERIOD: "missed_period",
  PELVIC_PAIN: "pelvic_pain",
  VAGINAL_DISCHARGE: "vaginal_discharge",
  PAINFUL_PERIOD: "painful_period",
  ABNORMAL_BLEEDING: "abnormal_bleeding",
  URINARY_SYMPTOMS: "urinary_symptoms",
  GENERAL_MENSTRUAL: "general_menstrual_health",
  PREGNANCY_CONCERN: "pregnancy_concern",
  GENERAL_GYNAE: "general_gynae",
  OUT_OF_SCOPE: "out_of_scope",
};

const CATEGORY_INFO = {
  [GYNAE_CATEGORIES.MISSED_PERIOD]: {
    name: "Missed or Irregular Period",
    description:
      "Questions about delayed, missed, or irregular menstrual periods.",
  },

  [GYNAE_CATEGORIES.PELVIC_PAIN]: {
    name: "Pelvic or Abdominal Pain",
    description:
      "Questions about pelvic, lower abdominal, or reproductive-area pain.",
  },

  [GYNAE_CATEGORIES.VAGINAL_DISCHARGE]: {
    name: "Vaginal Discharge",
    description:
      "Questions about unusual vaginal discharge, odor, color, or consistency.",
  },

  [GYNAE_CATEGORIES.PAINFUL_PERIOD]: {
    name: "Painful Periods",
    description:
      "Questions about menstrual cramps or pain during periods.",
  },

  [GYNAE_CATEGORIES.ABNORMAL_BLEEDING]: {
    name: "Abnormal Vaginal Bleeding",
    description:
      "Questions about unusually heavy, prolonged, or unexpected vaginal bleeding.",
  },

  [GYNAE_CATEGORIES.URINARY_SYMPTOMS]: {
    name: "Urinary Symptoms",
    description:
      "Questions about burning, pain, urgency, frequency, or discomfort while urinating.",
  },

  [GYNAE_CATEGORIES.GENERAL_MENSTRUAL]: {
    name: "General Menstrual Health",
    description:
      "General questions related to menstruation, hormones, and menstrual symptoms.",
  },

  [GYNAE_CATEGORIES.PREGNANCY_CONCERN]: {
    name: "Pregnancy Concern",
    description:
      "Questions about possible pregnancy, pregnancy-related symptoms, or pregnancy concerns.",
  },

  [GYNAE_CATEGORIES.GENERAL_GYNAE]: {
    name: "General Gynecological Health",
    description:
      "General women's gynecological and reproductive health questions.",
  },

  [GYNAE_CATEGORIES.OUT_OF_SCOPE]: {
    name: "Out of Scope",
    description:
      "Questions unrelated to women's gynecological or reproductive health.",
  },
};

module.exports = {
  GYNAE_CATEGORIES,
  CATEGORY_INFO,
};