const Pregnancy = require("../models/Pregnancy");
const PregnancyReminder = require("../models/PregnancyReminder");
const ApiError = require("../utils/ApiError");

// Get all reminders
const getReminders = async (userId) => {
  const pregnancy = await Pregnancy.findOne({
    user: userId,
    isActive: true,
  });

  if (!pregnancy) {
    throw new ApiError(404, "Active pregnancy not found.");
  }

  return await PregnancyReminder.find({
    pregnancy: pregnancy._id,
  }).sort({ week: 1 });
};

// Mark reminder completed
const completeReminder = async (userId, reminderId) => {
  const pregnancy = await Pregnancy.findOne({
    user: userId,
    isActive: true,
  });

  if (!pregnancy) {
    throw new ApiError(404, "Active pregnancy not found.");
  }

  const reminder = await PregnancyReminder.findOne({
    _id: reminderId,
    pregnancy: pregnancy._id,
  });

  if (!reminder) {
    throw new ApiError(404, "Reminder not found.");
  }

  reminder.completed = true;
  reminder.completedAt = new Date();

  await reminder.save();

  return reminder;
};

// Get next pending reminder
const getUpcomingReminder = async (userId) => {
  const pregnancy = await Pregnancy.findOne({
    user: userId,
    isActive: true,
  });

  if (!pregnancy) {
    throw new ApiError(404, "Active pregnancy not found.");
  }

  const reminder = await PregnancyReminder.findOne({
    pregnancy: pregnancy._id,
    completed: false,
    week: { $gte: pregnancy.currentWeek },
  }).sort({ week: 1 });

  return reminder;
};

module.exports = {
  getReminders,
  completeReminder,
  getUpcomingReminder,
};