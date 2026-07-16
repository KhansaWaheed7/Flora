const Cycle = require("../models/Cycle");
const ApiError = require("../utils/ApiError");

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

module.exports = {
  createCycle,
  getUserCycles,
  getCycleById,
  updateCycle,
  deleteCycle,
};