const DAY = 24 * 60 * 60 * 1000;

// Calculate Due Date (40 weeks / 280 days)
 
const calculateDueDate = (lastPeriodDate) => {
  const dueDate = new Date(lastPeriodDate);

  dueDate.setDate(dueDate.getDate() + 280);

  return dueDate;
};

// Calculate Current Pregnancy Week

const calculateCurrentWeek = (lastPeriodDate) => {
  const today = new Date();

  const lmp = new Date(lastPeriodDate);

  const difference = today - lmp;

  const weeks = Math.floor(difference / (7 * DAY)) + 1;

  return Math.max(1, Math.min(weeks, 42));
};


// Determine Trimester
const calculateTrimester = (week) => {
  if (week <= 13) return 1;

  if (week <= 27) return 2;

  return 3;
};


// Pregnancy Timeline
const pregnancyTimeline = {
  6: "Viability Scan",
  12: "NT Scan",
  20: "Anomaly Scan",
  26: "OGTT Test",
  32: "Growth Scan",
  36: "Weekly Antenatal Visits",
  38: "Delivery Preparation",
};


// Get Next Reminder

const getNextReminder = (week) => {
  const weeks = Object.keys(pregnancyTimeline)
    .map(Number)
    .sort((a, b) => a - b);

  const nextWeek = weeks.find((w) => w >= week);

  if (!nextWeek) {
    return {
      week: null,
      reminder: "No upcoming reminders",
    };
  }

  return {
    week: nextWeek,
    reminder: pregnancyTimeline[nextWeek],
  };
};
const pregnancyWeekData = {
  4: {
    baby: "Tiny embryo begins developing.",
    mother: "You may miss your period and feel tired.",
    tips: [
      "Start taking folic acid.",
      "Avoid smoking and alcohol.",
      "Drink plenty of water.",
    ],
  },

  8: {
    baby: "Baby's heart is beating and organs are forming.",
    mother: "Morning sickness is common.",
    tips: [
      "Eat small frequent meals.",
      "Get enough rest.",
      "Stay hydrated.",
    ],
  },

  12: {
    baby: "Baby can move although you cannot feel it yet.",
    mother: "Morning sickness usually improves.",
    tips: [
      "Attend your NT scan.",
      "Continue prenatal vitamins.",
      "Walk daily.",
    ],
  },

  16: {
    baby: "Baby's facial muscles are developing.",
    mother: "Energy levels usually increase.",
    tips: [
      "Increase iron intake.",
      "Stay physically active.",
      "Sleep on your side.",
    ],
  },

  20: {
    baby: "Halfway there! Baby can hear sounds.",
    mother: "You may begin feeling kicks.",
    tips: [
      "Attend anomaly scan.",
      "Increase protein intake.",
      "Stay active.",
    ],
  },

  24: {
    baby: "Baby responds to voices.",
    mother: "Back pain may begin.",
    tips: [
      "Stretch gently.",
      "Monitor baby's movement.",
      "Drink more water.",
    ],
  },

  28: {
    baby: "Eyes can open and close.",
    mother: "Third trimester begins.",
    tips: [
      "Discuss birth plan.",
      "Count fetal kicks.",
      "Sleep on your left side.",
    ],
  },

  32: {
    baby: "Baby gains weight rapidly.",
    mother: "Shortness of breath may occur.",
    tips: [
      "Attend growth scan.",
      "Rest often.",
      "Eat calcium-rich foods.",
    ],
  },

  36: {
    baby: "Baby moves into birth position.",
    mother: "Braxton Hicks contractions increase.",
    tips: [
      "Pack hospital bag.",
      "Attend weekly visits.",
      "Prepare for delivery.",
    ],
  },

  40: {
    baby: "Baby is fully developed.",
    mother: "Labour may begin anytime.",
    tips: [
      "Contact your doctor if contractions start.",
      "Monitor fetal movement.",
      "Stay calm and prepared.",
    ],
  },
};
const getWeekData = (week) => {
  const availableWeeks = Object.keys(pregnancyWeekData)
    .map(Number)
    .sort((a, b) => a - b);

  let closestWeek = availableWeeks[0];

  for (const w of availableWeeks) {
    if (week >= w) {
      closestWeek = w;
    }
  }

  return pregnancyWeekData[closestWeek];
};

const calculateWeeksRemaining = (week) => {
  return Math.max(40 - week, 0);
};

const calculatePregnancyProgress = (week) => {
  return Math.round((week / 40) * 100);
};

module.exports = {
  calculateDueDate,
  calculateCurrentWeek,
  calculateTrimester,
  pregnancyTimeline,
  getNextReminder,
  pregnancyWeekData,
  getWeekData,
  calculateWeeksRemaining,
  calculatePregnancyProgress,
};