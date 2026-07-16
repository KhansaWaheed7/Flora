const analyzeCycle = (
  averageCycle,
  periodLength
) => {
  let status = "Regular";

  const insights = [];

  if (averageCycle < 21) {
    status = "Irregular";

    insights.push(
      "Cycle is shorter than normal."
    );
  }

  if (averageCycle > 35) {
    status = "Irregular";

    insights.push(
      "Cycle is longer than normal."
    );
  }

  if (periodLength > 7) {
    insights.push(
      "Period lasts longer than expected."
    );
  }

  if (periodLength < 2) {
    insights.push(
      "Very short menstrual period."
    );
  }

  if (insights.length === 0) {
    insights.push(
      "Your menstrual cycle appears healthy."
    );
  }

  return {
    status,
    insights,
  };
};

module.exports = analyzeCycle;