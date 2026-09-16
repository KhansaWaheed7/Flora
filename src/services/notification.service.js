const Notification = require("../models/Notification");
const Cycle = require("../models/Cycle");
const Pregnancy = require("../models/Pregnancy");
const PregnancyReminder = require("../models/PregnancyReminder");

const { calculateAverageCycleLength, addDays } = require("../utils/cyclePrediction");
const detectIrregularCycle = require("../utils/irregularCycle");
const { calculateCurrentWeek } = require("../utils/pregnancyTimeline");

const createNotification = async ({
  userId,
  type,
  title,
  message,
  link = "",
  priority = "normal",
  uniqueKey,
  metadata = {},
  expiresAt = null,
}) => {
  if (!userId || !uniqueKey) return null;

  return Notification.findOneAndUpdate(
    { user: userId, uniqueKey },
    {
      $setOnInsert: {
        user: userId,
        type,
        title,
        message,
        link,
        priority,
        uniqueKey,
        metadata,
        expiresAt,
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
};

const markRead = async (userId, notificationId) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { $set: { read: true, readAt: new Date() } },
    { new: true }
  );
};

const markAllRead = async (userId) => {
  return Notification.updateMany(
    { user: userId, read: false },
    { $set: { read: true, readAt: new Date() } }
  );
};

// Create time-based notifications from the health data that already exists.
// This is intentionally idempotent, so refreshing the dashboard never creates duplicates.
const syncTimeBasedNotifications = async (userId) => {
  const now = new Date();

  // Cycle reminders: next period, ovulation and fertile window.
  const cycles = await Cycle.find({ user: userId }).sort({ periodStart: 1 }).lean();
  if (cycles.length) {
    const averageCycle = calculateAverageCycleLength(cycles);
    const latest = cycles[cycles.length - 1];

    if (detectIrregularCycle(cycles)) {
      await createNotification({
        userId,
        type: "cycle",
        title: "Irregular cycle pattern detected",
        message: "Your recent cycle history shows more variation than usual. Consider discussing persistent changes with a healthcare professional.",
        link: "/cycle-tracker/statistics",
        priority: "normal",
        uniqueKey: `cycle-irregular-${latest._id}`,
        metadata: { cycleId: latest._id },
      });
    }
    const nextPeriod = addDays(latest.periodStart, averageCycle);
    const ovulation = addDays(nextPeriod, -14);
    const fertileStart = addDays(ovulation, -5);
    const fertileEnd = addDays(ovulation, 1);

    const daysUntil = (date) =>
      Math.ceil((new Date(date) - now) / (1000 * 60 * 60 * 24));

    const periodDays = daysUntil(nextPeriod);
    if (periodDays >= 0 && periodDays <= 7) {
      await createNotification({
        userId,
        type: "cycle",
        title: periodDays === 0 ? "Your period is due today" : "Period reminder",
        message:
          periodDays === 0
            ? "Your predicted period may start today."
            : `Your next period is predicted in ${periodDays} day${periodDays === 1 ? "" : "s"}.`,
        link: "/cycle-tracker/predictions",
        priority: periodDays <= 1 ? "high" : "normal",
        uniqueKey: `cycle-period-${new Date(nextPeriod).toISOString().slice(0, 10)}`,
        metadata: { date: nextPeriod, daysUntil: periodDays },
      });
    }

    const ovulationDays = daysUntil(ovulation);
    if (ovulationDays >= 0 && ovulationDays <= 5) {
      await createNotification({
        userId,
        type: "cycle",
        title: ovulationDays === 0 ? "Predicted ovulation is today" : "Ovulation reminder",
        message:
          ovulationDays === 0
            ? "Your predicted ovulation day is today."
            : `Your predicted ovulation is in ${ovulationDays} day${ovulationDays === 1 ? "" : "s"}.`,
        link: "/cycle-tracker/predictions",
        uniqueKey: `cycle-ovulation-${new Date(ovulation).toISOString().slice(0, 10)}`,
        metadata: { date: ovulation, daysUntil: ovulationDays },
      });
    }

    const fertileStartDays = daysUntil(fertileStart);
    const fertileEndDays = daysUntil(fertileEnd);
    if (fertileStartDays <= 5 && fertileEndDays >= 0) {
      await createNotification({
        userId,
        type: "cycle",
        title: "Fertile window reminder",
        message: "Your predicted fertile window is approaching or currently active.",
        link: "/cycle-tracker/predictions",
        uniqueKey: `cycle-fertile-${new Date(fertileStart).toISOString().slice(0, 10)}`,
        metadata: { start: fertileStart, end: fertileEnd },
      });
    }
  }

  // Pregnancy reminders: make the existing weekly reminder records visible in the
  // common notification center when their week is current or within the next 2 weeks.
  const pregnancy = await Pregnancy.findOne({ user: userId, isActive: true }).lean();
  if (pregnancy) {
    const currentWeek = calculateCurrentWeek(pregnancy.lastPeriodDate);
    const reminders = await PregnancyReminder.find({
      pregnancy: pregnancy._id,
      completed: false,
      week: { $gte: currentWeek, $lte: currentWeek + 2 },
    }).sort({ week: 1 }).lean();

    for (const reminder of reminders) {
      const weeksAway = reminder.week - currentWeek;
      const message =
        weeksAway === 0
          ? `Your pregnancy reminder for week ${reminder.week} is due now.`
          : `${reminder.title} is coming up in ${weeksAway} week${weeksAway === 1 ? "" : "s"}.`;

      await createNotification({
        userId,
        type: "pregnancy",
        title: reminder.title,
        message,
        link: `/pregnancy/reminders/${reminder._id}`,
        priority: weeksAway === 0 ? "high" : "normal",
        uniqueKey: `pregnancy-reminder-${reminder._id}-week-${reminder.week}`,
        metadata: { reminderId: reminder._id, week: reminder.week },
      });
    }

    const dueDays = Math.ceil(
      (new Date(pregnancy.dueDate) - now) / (1000 * 60 * 60 * 24)
    );

    if (dueDays >= 0 && dueDays <= 14) {
      await createNotification({
        userId,
        type: "pregnancy",
        title: dueDays === 0 ? "Your due date is today" : "Due date reminder",
        message:
          dueDays === 0
            ? "Your estimated due date is today."
            : `Your estimated due date is in ${dueDays} day${dueDays === 1 ? "" : "s"}.`,
        link: "/pregnancy",
        priority: dueDays <= 3 ? "high" : "normal",
        uniqueKey: `pregnancy-due-${new Date(pregnancy.dueDate).toISOString().slice(0, 10)}`,
        metadata: { dueDate: pregnancy.dueDate, daysUntil: dueDays },
      });
    }
  }
};

const getNotifications = async (userId, { limit = 50, unreadOnly = false } = {}) => {
  await syncTimeBasedNotifications(userId);

  const filter = { user: userId };
  if (unreadOnly) filter.read = false;

  return Notification.find(filter)
    .sort({ createdAt: -1 })
    .limit(Math.min(Number(limit) || 50, 100))
    .lean();
};

const getUnreadCount = async (userId) => {
  await syncTimeBasedNotifications(userId);
  return Notification.countDocuments({ user: userId, read: false });
};

module.exports = {
  createNotification,
  getNotifications,
  getUnreadCount,
  markRead,
  markAllRead,
  syncTimeBasedNotifications,
};
