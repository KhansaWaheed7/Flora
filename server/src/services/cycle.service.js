const Cycle = require("../models/Cycle");
const ApiError = require("../utils/ApiError");
const {
  calculateAverageCycleLength,
  addDays,
} = require("../utils/cyclePrediction");
const detectIrregularCycle = require("../utils/irregularCycle");

const createCycle = async (userId, data) => {
  const cycle = await Cycle.create({
    user: userId,
    ...data,
  });

  return cycle;
};

const getUserCycles = async (userId) => {
  return await Cycle.find({ user: userId }).sort({
    periodStart: -1,
  });
};

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

const updateCycle = async (userId, cycleId, data) => {
  const cycle = await Cycle.findOneAndUpdate(
    {
      _id: cycleId,
      user: userId,
    },
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!cycle) {
    throw new ApiError(404, "Cycle not found");
  }

  return cycle;
};

const deleteCycle = async (userId, cycleId) => {
  const cycle = await Cycle.findOneAndDelete({
    _id: cycleId,
    user: userId,
  });

  if (!cycle) {
    throw new ApiError(404, "Cycle not found");
  }
};

const predictCycle = async (userId) => {
  const cycles = await Cycle.find({
    user: userId,
  }).sort({
    periodStart: 1,
  });

  if (cycles.length === 0) {
    throw new ApiError(404, "No cycle history found");
  }

  const averageCycle =
    calculateAverageCycleLength(cycles);

  const latestCycle =
    cycles[cycles.length - 1];

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

  return {
    averageCycleLength: averageCycle,
    nextPeriod,
    ovulation,
    fertileWindow: {
      start: fertileStart,
      end: fertileEnd,
    },
    irregularCycle: detectIrregularCycle(cycles),
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
