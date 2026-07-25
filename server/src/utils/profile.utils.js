const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;

  const today = new Date();
  const birth = new Date(dateOfBirth);

  let age = today.getFullYear() - birth.getFullYear();

  const month = today.getMonth() - birth.getMonth();

  if (
    month < 0 ||
    (month === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
};

const calculateBMI = (height, weight) => {
  if (!height || !weight) return null;

  const bmi = weight / Math.pow(height / 100, 2);

  return Number(bmi.toFixed(1));
};

const getBMICategory = (bmi) => {
  if (bmi === null) return null;

  if (bmi < 18.5) return "Underweight";

  if (bmi < 25) return "Normal";

  if (bmi < 30) return "Overweight";

  return "Obese";
};

module.exports = {
  calculateAge,
  calculateBMI,
  getBMICategory,
};