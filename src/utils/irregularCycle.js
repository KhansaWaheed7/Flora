const detectIrregularCycle = (cycles) => {
  if (cycles.length < 3) {
    return false;
  }

  const lengths = [];

  for (let i = 1; i < cycles.length; i++) {
    const previous = new Date(cycles[i - 1].periodStart);
    const current = new Date(cycles[i].periodStart);

    lengths.push(
      (current - previous) /
        (1000 * 60 * 60 * 24)
    );
  }

  const min = Math.min(...lengths);
  const max = Math.max(...lengths);

  return max - min > 7;
};

module.exports = detectIrregularCycle;