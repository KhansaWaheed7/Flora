const Pregnancy = require("../models/Pregnancy");
const ApiError = require("../utils/ApiError");
const PregnancyWeek = require("../models/PregnancyWeek");
const generatePregnancyReminders = require("../utils/generatePregnancyReminders");
const PregnancyReminder = require("../models/PregnancyReminder");

const {
  calculateDueDate,
  calculateCurrentWeek,
  calculateTrimester,
  calculateWeeksRemaining,
  calculatePregnancyProgress,
  getNextReminder,
} = require("../utils/pregnancyTimeline");


// Create Pregnancy

const createPregnancy = async (userId, lastPeriodDate) => {
  const existing = await Pregnancy.findOne({
    user: userId,
    isActive: true,
  });

  if (existing) {
    throw new ApiError(
  400,
  "Active pregnancy already exists."
);
  }
const lmp = new Date(lastPeriodDate);
const today = new Date();

if (lmp > today) {
  throw new ApiError(
    400,
    "Last menstrual period cannot be in the future."
  );
}

const daysDifference =
  (today - lmp) / (1000 * 60 * 60 * 24);

if (daysDifference > 294) {
  throw new ApiError(
    400,
    "Pregnancy duration exceeds the supported range."
  );
}
  const dueDate = calculateDueDate(lastPeriodDate);

  const currentWeek = calculateCurrentWeek(lastPeriodDate);

  const trimester = calculateTrimester(currentWeek);

  const pregnancy = await Pregnancy.create({
  user: userId,
  lastPeriodDate,
  dueDate,
  currentWeek,
  trimester,
});
await generatePregnancyReminders(pregnancy._id);


return pregnancy;
};

// Get Pregnancy

const getPregnancy = async (userId) => {
  const pregnancy = await Pregnancy.findOne({
    user: userId,
    isActive: true,
  });

  if (!pregnancy) {
    return null;
  }

  pregnancy.currentWeek = calculateCurrentWeek(
    pregnancy.lastPeriodDate
  );

  pregnancy.trimester = calculateTrimester(
    pregnancy.currentWeek
  );

  await pregnancy.save();

  return pregnancy;
};


// Pregnancy Dashboard


const getPregnancyDashboard = async (userId) => {
  const pregnancy = await getPregnancy(userId);

  if (!pregnancy) {
    return null;
  }

  const reminder = getNextReminder(
    pregnancy.currentWeek
  );

  const weekInfo = await PregnancyWeek.findOne({
  week: { $lte: pregnancy.currentWeek },
})
  .sort({ week: -1 })
  .lean();

 const upcomingReminder = await PregnancyReminder.findOne({
  pregnancy: pregnancy._id,
  completed: false,
  week: { $gte: pregnancy.currentWeek },
}).sort({ week: 1 });

const weeksRemaining = calculateWeeksRemaining(
  pregnancy.currentWeek
);

const progress = calculatePregnancyProgress(
  pregnancy.currentWeek
);

return {
  pregnancy: {
    currentWeek: pregnancy.currentWeek,
    trimester: pregnancy.trimester,
    dueDate: pregnancy.dueDate,
  },

  progress,

  weeksRemaining,

  weekInfo,

  upcomingReminder,
};
};


// Update Pregnancy

const updatePregnancy = async (
  userId,
  lastPeriodDate
) => {
  const pregnancy = await Pregnancy.findOne({
    user: userId,
    isActive: true,
  });

  if (!pregnancy) {
    throw new ApiError(
  404,
  "Pregnancy record not found."
);
  }

  const lmp = new Date(lastPeriodDate);
const today = new Date();

if (lmp > today) {
  throw new ApiError(
    400,
    "Last menstrual period cannot be in the future."
  );
}

const daysDifference =
  (today - lmp) / (1000 * 60 * 60 * 24);

if (daysDifference > 294) {
  throw new ApiError(
    400,
    "Pregnancy duration exceeds the supported range."
  );
}

  pregnancy.lastPeriodDate = lastPeriodDate;

  pregnancy.dueDate =
    calculateDueDate(lastPeriodDate);

  pregnancy.currentWeek =
    calculateCurrentWeek(lastPeriodDate);

  pregnancy.trimester =
    calculateTrimester(pregnancy.currentWeek);

  await pregnancy.save();
  await PregnancyReminder.updateMany(
  { pregnancy: pregnancy._id },
  {
    $set: {
      completed: false,
      completedAt: null,
    },
  }
);

  return pregnancy;
};


// End Pregnancy

const endPregnancy = async (userId) => {
  const pregnancy = await Pregnancy.findOne({
    user: userId,
    isActive: true,
  });

  if (!pregnancy) {
    throw new Error("Pregnancy record not found.");
  }

  pregnancy.isActive = false;

  await pregnancy.save();

  return pregnancy;
};

module.exports = {
  createPregnancy,
  getPregnancy,
  getPregnancyDashboard,
  updatePregnancy,
  endPregnancy,
  
};