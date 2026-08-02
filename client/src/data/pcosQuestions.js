export const questions = [
  {
    key: "age",
    type: "number",
    label: "How old are you?",
    sidebarLabel: "What is your age?",
    unit: "years",
    placeholder: "e.g. 22",
  },
  {
    key: "heightWeight",
    type: "height_weight",
    label: "What is your height and weight?",
    sidebarLabel: "What is your BMI?",
    hint: "We'll use this to calculate your BMI automatically.",
  },
  {
    key: "cycleLength",
    type: "number",
    label: "What is your average menstrual cycle length?",
    sidebarLabel: "What is your average menstrual cycle length?",
    unit: "days",
    placeholder: "e.g. 35",
    hint: "Count the number of days from the first day of one period to the first day of the next period.",
    helperNote: "A normal cycle length is typically 21-35 days.",
  },
  {
    key: "irregularCycles",
    type: "yesno",
    label: "Are your menstrual cycles irregular?",
    sidebarLabel: "Do you have irregular periods?",
  },
  {
    key: "weightGain",
    type: "yesno",
    label: "Have you experienced weight gain recently?",
    sidebarLabel: "Do you experience weight gain?",
  },
  {
    key: "acne",
    type: "yesno",
    label: "Do you frequently experience acne or persistent pimples?",
    sidebarLabel: "Do you have acne?",
  },
  {
    key: "hairLoss",
    type: "yesno",
    label: "Have you noticed excessive hair loss or thinning?",
    sidebarLabel: "Do you have hair loss?",
  },
  {
    key: "hirsutism",
    type: "yesno",
    label:
      "Do you have excessive hair growth on your face, chest, abdomen, or other areas?",
    sidebarLabel: "Do you have excessive hair growth?",
  },
  {
    key: "skinPatches",
    type: "yesno",
    label:
      "Have you noticed dark, velvety patches of skin around your neck, underarms, or other body folds?",
    sidebarLabel: "Do you have skin darkening?",
  },
  {
    key: "exerciseFrequency",
    type: "number",
    label: "How many days per week do you exercise?",
    sidebarLabel: "How often do you exercise?",
    unit: "days/week",
    placeholder: "e.g. 3",
    hint: "Enter a number from 0 (never) to 7 (every day).",
  },
  {
    key: "fastFood",
    type: "yesno",
    label: "Do you eat fast food frequently?",
    sidebarLabel: "Do you eat fast food often?",
  },
];

export const TOTAL_QUESTIONS = questions.length;
