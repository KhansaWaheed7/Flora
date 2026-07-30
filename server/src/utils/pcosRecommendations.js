const getRecommendations = (result, answers) => {
  const recommendations = [];

  // Risk-based recommendations
  if (result.risk === "High") {
    recommendations.push(
      "Schedule a consultation with a gynecologist for a comprehensive evaluation."
    );
    recommendations.push(
      "Do not rely solely on this AI assessment for diagnosis."
    );
  } else if (result.risk === "Medium") {
    recommendations.push(
      "Monitor your symptoms and consider consulting a healthcare professional if they persist."
    );
  } else {
    recommendations.push(
      "Continue maintaining a healthy lifestyle and monitor your menstrual cycles regularly."
    );
  }

  // Personalized recommendations
  if (answers.bmi >= 25) {
    recommendations.push(
      "Maintain a healthy weight through balanced nutrition and regular physical activity."
    );
  }

  if (answers.irregularPeriods) {
    recommendations.push(
      "Track your menstrual cycles using Flora to identify long-term patterns."
    );
  }

  if (answers.fastFood) {
    recommendations.push(
      "Reduce fast-food intake and increase consumption of whole foods, fruits, and vegetables."
    );
  }

  if (answers.exerciseFrequency === 0) {
    recommendations.push(
      "Aim for at least 150 minutes of moderate physical activity each week."
    );
  }

  if (answers.acne || answers.excessiveHairGrowth) {
    recommendations.push(
      "Discuss hormonal testing with a healthcare provider if these symptoms continue."
    );
  }

  if (answers.weightGain) {
    recommendations.push(
      "Monitor your weight regularly and seek nutritional advice if needed."
    );
  }

  return [...new Set(recommendations)];
};

module.exports = getRecommendations;