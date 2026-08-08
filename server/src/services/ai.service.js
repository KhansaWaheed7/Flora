const axios = require("axios");

const predictPCOS = async (answers) => {
  const response = await axios.post(
    "http://127.0.0.1:8000/predict",
    {
      age: answers.age,
      bmi: answers.bmi,
      cycleLength: answers.cycleLength,
      irregularPeriods: answers.irregularPeriods,
      weightGain: answers.weightGain,
      acne: answers.acne,
      hairLoss: answers.hairLoss,
      excessiveHairGrowth: answers.excessiveHairGrowth,
      darkSkinPatches: answers.darkSkinPatches,

      // Convert exercise frequency into boolean
      exercise: answers.exerciseFrequency > 0,

      fastFood: answers.fastFood,
    }
  );

  return response.data;
};

module.exports = {
  predictPCOS,
};