export const questions = [
  {
    key: "age",
    type: "number",
    label: "How old are you?",
    sidebarLabel: "Your age",
    unit: "years",
    placeholder: "e.g. 22",
  },

  {
    key: "heightWeight",
    type: "height_weight",
    label: "What are your height and weight?",
    sidebarLabel: "Height & weight",
    hint: "We'll use these to calculate your BMI automatically.",
  },

  {
    key: "cycleLength",
    type: "number",
    label: "How long is your menstrual cycle usually?",
    sidebarLabel: "Cycle length",
    unit: "days",
    placeholder: "e.g. 28",
    hint:
      "Count from the first day of one period to the first day of your next period.",
    helperNote:
      "Most menstrual cycles are around 21–35 days, but everyone's cycle can be different.",
  },

  {
    key: "irregularCycles",
    type: "frequency",
    label: "How often is your menstrual cycle irregular?",
    sidebarLabel: "Irregular periods",
    hint:
      "Think about how often your periods come earlier, later, or vary significantly from your usual pattern.",
  },

  {
    key: "weightGain",
    type: "frequency",
    label: "How often have you noticed unexplained weight gain?",
    sidebarLabel: "Weight changes",
    hint:
      "Consider changes that happened without a major change in your diet or activity.",
  },

  {
    key: "acne",
    type: "frequency",
    label: "How often do you experience acne or persistent breakouts?",
    sidebarLabel: "Acne & breakouts",
    hint:
      "Include frequent or persistent breakouts, especially on the face, chest, or back.",
  },

  {
    key: "hairLoss",
    type: "frequency",
    label: "How often do you notice unusual hair loss or thinning?",
    sidebarLabel: "Hair loss",
    hint:
      "Think about noticeable thinning or more hair loss than you normally experience.",
  },

  {
    key: "hirsutism",
    type: "frequency",
    label: "How often do you notice extra hair growth on your face or body?",
    sidebarLabel: "Excess hair growth",
    hint:
      "For example, noticeable hair growth on the face, chest, abdomen, or other areas.",
  },

  {
    key: "skinPatches",
    type: "yesno",
    label: "Have you noticed darker, velvety patches of skin?",
    sidebarLabel: "Skin changes",
    hint:
      "These patches may appear around the neck, underarms, or other skin folds.",
  },

  {
    key: "exerciseFrequency",
    type: "number",
    label: "How many days a week do you usually exercise?",
    sidebarLabel: "Physical activity",
    unit: "days/week",
    placeholder: "e.g. 3",
    hint:
      "Enter a number from 0 to 7. Include activities such as walking, workouts, sports, or other regular exercise.",
  },

  {
    key: "fastFood",
    type: "frequency",
    label: "How often do you eat fast food or highly processed foods?",
    sidebarLabel: "Diet habits",
    hint:
      "Think about foods such as fast food, fried foods, packaged snacks, or highly processed meals.",
  },
];

export const TOTAL_QUESTIONS = questions.length;