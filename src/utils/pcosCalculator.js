const getRecommendations = (risk) => {
  switch (risk) {
    case "High":
      return [
        "Consult a gynaecologist for a comprehensive PCOS evaluation.",
        "Maintain a healthy weight through a balanced diet and regular exercise.",
        "Track your menstrual cycle regularly.",
        "Consider hormone and blood sugar testing as advised by your doctor.",
      ];

    case "Medium":
      return [
        "Monitor your symptoms regularly.",
        "Maintain a balanced diet and exercise routine.",
        "Track your menstrual cycle every month.",
        "Consult a doctor if symptoms worsen.",
      ];

    default:
      return [
        "Continue maintaining a healthy lifestyle.",
        "Exercise regularly.",
        "Eat a balanced diet.",
        "Keep monitoring your menstrual health.",
      ];
  }
};

const calculatePCOSRisk = (answers) => {
  let score = 0;

  if (answers.irregularPeriods) score += 2;
  if (answers.weightGain) score += 1;
  if (answers.acne) score += 1;
  if (answers.hairLoss) score += 1;
  if (answers.excessiveHairGrowth) score += 2;
  if (answers.darkSkinPatches) score += 2;

  if (answers.bmi >= 25) score += 1;

  if (answers.cycleLength > 35) score += 2;

  if (answers.exerciseFrequency == 0) score += 1;
  if (answers.fastFood) score += 1;


  let risk = "Low";

  if (score >= 10) {
    risk = "High";
  } else if (score >= 6) {
    risk = "Medium";
  }

  const probability = Math.min(Math.round((score / 15) * 100), 100);

  return {
    score,
    risk,
    probability,
    prediction: risk !== "Low",
    confidence: probability,
    recommendations: getRecommendations(risk),
  };
};

module.exports = calculatePCOSRisk;