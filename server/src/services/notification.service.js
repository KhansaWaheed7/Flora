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

const deleteNotification = async (userId, notificationId) => {
  return Notification.findOneAndDelete({
    _id: notificationId,
    user: userId,
  });
};


const syncTimeBasedNotifications = async (userId) => {
  const now = new Date();

  // =========================
  // CYCLE NOTIFICATIONS
  // =========================

  const cycles = await Cycle.find({ user: userId })
    .sort({ periodStart: 1 })
    .lean();

  if (cycles.length) {
    const averageCycle = calculateAverageCycleLength(cycles);
    const latest = cycles[cycles.length - 1];

    // Important: irregular cycle
    if (detectIrregularCycle(cycles)) {
      await createNotification({
        userId,
        type: "cycle",
        title: "Irregular cycle pattern detected",
        message:
          "Your recent cycle history shows more variation than usual. Consider discussing persistent changes with a healthcare professional.",
        link: "/cycle-tracker/statistics",
        priority: "normal",
        uniqueKey: `cycle-irregular-${latest._id}`,
        metadata: { cycleId: latest._id },
      });
    }

    const nextPeriod = addDays(latest.periodStart, averageCycle);

    const daysUntil = (date) =>
      Math.ceil(
        (new Date(date) - now) / (1000 * 60 * 60 * 24)
      );

    const periodDays = daysUntil(nextPeriod);

    // Period is today
    if (periodDays === 0) {
      await createNotification({
        userId,
        type: "cycle",
        title: "Your period is due today",
        message: "Your predicted period may start today.",
        link: "/cycle-tracker/predictions",
        priority: "high",
        uniqueKey: `cycle-period-${new Date(nextPeriod)
          .toISOString()
          .slice(0, 10)}`,
        metadata: {
          date: nextPeriod,
          daysUntil: periodDays,
        },
      });
    }

    // Period is within 1–2 days
    if (periodDays >= 1 && periodDays <= 2) {
      await createNotification({
        userId,
        type: "cycle",
        title: "Period coming soon",
        message: `Your next period is predicted in ${periodDays} day${
          periodDays === 1 ? "" : "s"
        }.`,
        link: "/cycle-tracker/predictions",
        priority: "normal",
        uniqueKey: `cycle-period-${new Date(nextPeriod)
          .toISOString()
          .slice(0, 10)}`,
        metadata: {
          date: nextPeriod,
          daysUntil: periodDays,
        },
      });
    }

    // =========================
    // OVULATION
    // =========================

    const ovulation = addDays(nextPeriod, -14);
    const ovulationDays = daysUntil(ovulation);

    // Only notify on predicted ovulation day
    if (ovulationDays === 0) {
      await createNotification({
        userId,
        type: "cycle",
        title: "Predicted ovulation is today",
        message: "Today is your predicted ovulation day.",
        link: "/cycle-tracker/predictions",
        priority: "normal",
        uniqueKey: `cycle-ovulation-${new Date(ovulation)
          .toISOString()
          .slice(0, 10)}`,
        metadata: {
          date: ovulation,
          daysUntil: ovulationDays,
        },
      });
    }
  }

  // =========================
  // PREGNANCY NOTIFICATIONS
  // =========================

  const pregnancy = await Pregnancy.findOne({
    user: userId,
    isActive: true,
  }).lean();

  if (pregnancy) {
    const currentWeek = calculateCurrentWeek(
      pregnancy.lastPeriodDate
    );

    // Only show pregnancy reminders due NOW
    const reminders = await PregnancyReminder.find({
      pregnancy: pregnancy._id,
      completed: false,
      week: currentWeek,
    })
      .sort({ week: 1 })
      .lean();

    for (const reminder of reminders) {
      await createNotification({
        userId,
        type: "pregnancy",
        title: reminder.title,
        message: `Your pregnancy reminder for week ${reminder.week} is due now.`,
        link: `/pregnancy/reminders/${reminder._id}`,
        priority: "high",
        uniqueKey: `pregnancy-reminder-${reminder._id}-week-${reminder.week}`,
        metadata: {
          reminderId: reminder._id,
          week: reminder.week,
        },
      });
    }

    // =========================
    // DUE DATE
    // =========================

    const dueDays = Math.ceil(
      (new Date(pregnancy.dueDate) - now) /
        (1000 * 60 * 60 * 24)
    );

    // Only notify when due date is within 3 days
    if (dueDays >= 0 && dueDays <= 3) {
      await createNotification({
        userId,
        type: "pregnancy",
        title:
          dueDays === 0
            ? "Your due date is today"
            : "Due date approaching",
        message:
          dueDays === 0
            ? "Your estimated due date is today."
            : `Your estimated due date is in ${dueDays} day${
                dueDays === 1 ? "" : "s"
              }.`,
        link: "/pregnancy",
        priority: "high",
        uniqueKey: `pregnancy-due-${new Date(
          pregnancy.dueDate
        )
          .toISOString()
          .slice(0, 10)}`,
        metadata: {
          dueDate: pregnancy.dueDate,
          daysUntil: dueDays,
        },
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
  deleteNotification,
  syncTimeBasedNotifications,
};
