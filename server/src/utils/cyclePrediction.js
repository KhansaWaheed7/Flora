const calculateAverageCycleLength = (cycles) => {
  if (cycles.length < 2) return 28;

  let total = 0;

  for (let i = 1; i < cycles.length; i++) {
    const previous = new Date(cycles[i - 1].periodStart);
    const current = new Date(cycles[i].periodStart);

    const diff =
      (current - previous) / (1000 * 60 * 60 * 24);

    total += diff;
  }

  return Math.round(total / (cycles.length - 1));
};

const addDays = (date, days) => {
  const d = new Date(date);

  d.setDate(d.getDate() + days);

  return d;
};

module.exports = {
  calculateAverageCycleLength,
  addDays,
};