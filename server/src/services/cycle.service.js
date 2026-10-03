const Cycle = require("../models/Cycle");
const Pregnancy = require("../models/Pregnancy");
const ApiError = require("../utils/ApiError");
const getCyclePhase = require("../utils/cyclePhase");

const {
  calculateAverageCycleLength,
  addDays,
} = require("../utils/cyclePrediction");

const detectIrregularCycle = require("../utils/irregularCycle");
const analyzeCycle = require("../utils/cycleHealth");
const { createNotification } = require("./notification.service");

const createCycle = async (userId, data) => {

  const activePregnancy = await Pregnancy.findOne({
    user: userId,
    isActive: true,
  });

  if (activePregnancy) {
    throw new ApiError(
      400,
      "Menstrual cycle tracking is paused while your pregnancy is active."
    );
  }

  // Prevent creating a second active period
  const activeCycle = await Cycle.findOne({
    user: userId,
    periodEnd: null,
  });

  if (activeCycle) {
    throw new ApiError(
      400,
      "You already have a period in progress. Please add its end date first."
    );
  }

const pregnancyRecord = await Pregnancy.findOne({
  user: userId,
}).lean();

const requiresNewCycle =
  pregnancyRecord?.cycleTrackingResetRequired === true;


const previousCycle = requiresNewCycle
  ? null
  : await Cycle.findOne({
      user: userId,
      periodEnd: { $ne: null },
    }).sort({
      periodStart: -1,
    });

let cycleLength = 28;

  if (previousCycle) {
    cycleLength = Math.round(
      (new Date(data.periodStart) -
        new Date(previousCycle.periodStart)) /
        (1000 * 60 * 60 * 24)
    );

    if (cycleLength < 15 || cycleLength > 60) {
      throw new ApiError(
        400,
        "Invalid cycle length calculated. Please check the dates."
      );
    }
  }

  let periodLength = null;


  if (data.periodEnd) {
    periodLength =
      Math.floor(
        (new Date(data.periodEnd) -
          new Date(data.periodStart)) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    if (periodLength < 1 || periodLength > 10) {
      throw new ApiError(
        400,
        "Invalid period length. Please check the dates."
      );
    }
  }

  const cycle = await Cycle.create({
    user: userId,
    periodStart: data.periodStart,
    periodEnd: data.periodEnd || null,
    periodLength,
    cycleLength,
    symptoms: data.symptoms || [],
    notes: data.notes || "",
  });

  if (requiresNewCycle && pregnancyRecord) {
  await Pregnancy.updateOne(
    {
      _id: pregnancyRecord._id,
      user: userId,
    },
    {
      $set: {
        cycleTrackingResetRequired: false,
      },
    }
  );
}

  await createNotification({
    userId,
    type: "cycle",
    title: "Period logged",
    message: "Your period has been successfully added to your cycle tracker.",
    link: `/cycle-tracker/${cycle._id}`,
    uniqueKey: `cycle-logged-${cycle._id}`,
    metadata: { cycleId: cycle._id },
  });

  return cycle;
};

/**
 * Get all cycles of logged-in user
 */
const getUserCycles = async (userId) => {
  return await Cycle.find({
    user: userId,
  }).sort({
    periodStart: -1,
  });
};

/**
 * Get one cycle
 */
const getCycleById = async (userId, cycleId) => {
  const cycle = await Cycle.findOne({
    _id: cycleId,
    user: userId,
  });

  if (!cycle) {
    throw new ApiError(404, "Cycle not found");
  }

  return cycle;
};

/**
 * Update cycle
 */
const updateCycle = async (userId, cycleId, data) => {
  const activePregnancy = await Pregnancy.findOne({
    user: userId,
    isActive: true,
  });

  if (activePregnancy) {
    throw new ApiError(
      400,
      "Menstrual cycle tracking is paused while your pregnancy is active."
    );
  }
  const pregnancyRecord = await Pregnancy.findOne({
  user: userId,
}).lean();

if (pregnancyRecord?.cycleTrackingResetRequired === true) {
  return {
    isTracking: false,
    isPaused: false,
    requiresNewCycle: true,
    reason: "needs_new_cycle",
    message:
      "Pregnancy tracking has ended. Please log your latest period to start a new menstrual cycle.",
  };
}

  const cycle = await Cycle.findOne({
    _id: cycleId,
    user: userId,
  });

  if (!cycle) {
    throw new ApiError(404, "Cycle not found");
  }

  // Update start date if provided
  if (data.periodStart) {
    cycle.periodStart = data.periodStart;
  }

  // Update end date if provided
  if (data.periodEnd !== undefined) {
    cycle.periodEnd = data.periodEnd || null;
  }

  if (data.symptoms) {
    cycle.symptoms = data.symptoms;
  }

  if (data.notes !== undefined) {
    cycle.notes = data.notes;
  }

  // Period is still in progress
  if (!cycle.periodEnd) {
    cycle.periodLength = null;
  } else {
    
    const periodLength =
      Math.floor(
        (new Date(cycle.periodEnd) -
          new Date(cycle.periodStart)) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    if (periodLength < 1 || periodLength > 10) {
      throw new ApiError(
        400,
        "Invalid period length. Please check the dates."
      );
    }

    cycle.periodLength = periodLength;
  }

  // Find the previous completed cycle
  const previousCycle = await Cycle.findOne({
    user: userId,
    _id: { $ne: cycleId },
    periodEnd: { $ne: null },
    periodStart: { $lt: cycle.periodStart },
  }).sort({
    periodStart: -1,
  });

  if (previousCycle) {
    cycle.cycleLength = Math.round(
      (new Date(cycle.periodStart) -
        new Date(previousCycle.periodStart)) /
        (1000 * 60 * 60 * 24)
    );
  } else {
    cycle.cycleLength = 28;
  }

  await cycle.save();

  await createNotification({
    userId,
    type: "cycle",
    title: "Cycle updated",
    message: "Your cycle information has been updated successfully.",
    link: `/cycle-tracker/${cycle._id}`,
    uniqueKey: `cycle-updated-${cycle._id}-${cycle.updatedAt?.getTime() || Date.now()}`,
    metadata: { cycleId: cycle._id },
  });

  return cycle;
};

/**
 * Delete cycle
 */
const deleteCycle = async (userId, cycleId) => {
  const cycle = await Cycle.findOneAndDelete({
    _id: cycleId,
    user: userId,
  });

  if (!cycle) {
    throw new ApiError(404, "Cycle not found");
  }
};

/**
 * Predict menstrual cycle
 */
const predictCycle = async (userId) => {
  const activePregnancy = await Pregnancy.findOne({
    user: userId,
    isActive: true,
  }).lean();

  if (activePregnancy) {
  return {
    isPaused: true,
    reason: "active_pregnancy",
    message: "Menstrual cycle tracking is paused during pregnancy.",
    pregnancyId: activePregnancy._id,
    dueDate: activePregnancy.dueDate,
  };
}

const pregnancyRecord = await Pregnancy.findOne({
  user: userId,
}).lean();

if (pregnancyRecord?.cycleTrackingResetRequired === true) {
  return {
    isTracking: false,
    isPaused: false,
    requiresNewCycle: true,
    reason: "needs_new_cycle",
    message:
      "Pregnancy tracking has ended. Please log your latest period to start a new menstrual cycle.",
  };
}

const cycles = await Cycle.find({
    user: userId,
  }).sort({
    periodStart: 1,
  });

  if (cycles.length === 0) {
    return {
      isTracking: false,
      isPaused: false,
      reason: "no_cycle_data",
      message: "No menstrual cycle has been logged yet.",
    };
  }

  const averageCycle = calculateAverageCycleLength(cycles);

  const latestCycle = cycles[cycles.length - 1];

  const isPeriodInProgress = !latestCycle.periodEnd;

  const currentPhase = getCyclePhase({
    cycleStart: latestCycle.periodStart,
    periodEnd: latestCycle.periodEnd,
    cycleLength: averageCycle,
    periodLength: latestCycle.periodLength,
  });


  const nextPeriod = addDays(
    latestCycle.periodStart,
    averageCycle
  );

  const ovulation = addDays(
    nextPeriod,
    -14
  );

  const fertileStart = addDays(
    ovulation,
    -5
  );

  const fertileEnd = addDays(
    ovulation,
    1
  );

  const health = analyzeCycle(
    averageCycle,
    latestCycle.periodLength
  );

  return {
    averageCycleLength: averageCycle,

    periodLength: latestCycle.periodLength,

    currentPhase,

    periodInProgress: isPeriodInProgress,

    currentPeriodStart: latestCycle.periodStart,

    currentPeriodEnd: latestCycle.periodEnd,

    nextPeriod,

    ovulation,

    fertileWindow: {
      start: fertileStart,
      end: fertileEnd,
    },

    irregularCycle: detectIrregularCycle(cycles),

    health,
  };
};

module.exports = {
  createCycle,
  getUserCycles,
  getCycleById,
  updateCycle,
  deleteCycle,
  predictCycle,
};