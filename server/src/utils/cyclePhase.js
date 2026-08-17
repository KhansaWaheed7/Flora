const getCyclePhase = ({
  cycleStart,
  currentDate = new Date(),
  cycleLength = 28,
  periodLength = 5,
}) => {
  const start = new Date(cycleStart);
  const current = new Date(currentDate);

  start.setHours(0, 0, 0, 0);
  current.setHours(0, 0, 0, 0);

  const cycleDay =
    Math.floor(
      (current - start) / (1000 * 60 * 60 * 24)
    ) + 1;

  // If current date is before the cycle started
  if (cycleDay < 1) {
    return {
      phase: "Unknown",
      cycleDay: 0,
      description: "Cycle has not started yet.",
    };
  }

  // Estimate ovulation
  const ovulationDay = Math.max(
    cycleLength - 14,
    1
  );

  const fertileStart = ovulationDay - 5;
  const fertileEnd = ovulationDay + 1;

  // Menstrual phase
  if (cycleDay <= periodLength) {
    return {
      phase: "Menstrual",
      cycleDay,
      description:
        "You are currently in your menstrual phase.",
    };
  }

  // Follicular phase
  if (cycleDay < fertileStart) {
    return {
      phase: "Follicular",
      cycleDay,
      description:
        "You are currently in the follicular phase.",
    };
  }

  // Fertile window / ovulation
  if (cycleDay >= fertileStart && cycleDay <= fertileEnd) {
    if (cycleDay === ovulationDay) {
      return {
        phase: "Ovulation",
        cycleDay,
        description:
          "You are approximately at your ovulation day.",
      };
    }

    return {
      phase: "Fertile Window",
      cycleDay,
      description:
        "You are currently within your estimated fertile window.",
    };
  }

  // Luteal phase
  if (cycleDay > fertileEnd && cycleDay <= cycleLength) {
    return {
      phase: "Luteal",
      cycleDay,
      description:
        "You are currently in the luteal phase.",
    };
  }

  // Cycle has gone beyond expected length
  return {
    phase: "Late / Possible Delay",
    cycleDay,
    description:
      "Your cycle has gone beyond the estimated cycle length.",
  };
};

module.exports = getCyclePhase;