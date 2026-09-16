const PregnancyReminder = require("../models/PregnancyReminder");

const REMINDERS = [
  {
    week: 6,
    title: "Viability Scan",
    description: "Confirm pregnancy and heartbeat.",
  },
  {
    week: 12,
    title: "NT Scan",
    description: "Nuchal translucency screening.",
  },
  {
    week: 20,
    title: "Anomaly Scan",
    description: "Detailed fetal anatomy scan.",
  },
  {
    week: 26,
    title: "OGTT Test",
    description: "Gestational diabetes screening.",
  },
  {
    week: 32,
    title: "Growth Scan",
    description: "Monitor baby's growth and development.",
  },
  {
    week: 36,
    title: "Weekly Antenatal Visit",
    description: "Begin weekly antenatal check-ups.",
  },
  {
    week: 38,
    title: "Delivery Preparation",
    description: "Prepare for labour and hospital admission.",
  },
];

const generatePregnancyReminders = async (
  pregnancy,
  lastPeriodDate
) => {
  const lmp = new Date(lastPeriodDate);

  const reminders = REMINDERS.map((item) => {
    const dueDate = new Date(lmp);

    dueDate.setDate(
      dueDate.getDate() + item.week * 7
    );

    return {
      pregnancy: pregnancy._id,
      user: pregnancy.user,
      week: item.week,
      title: item.title,
      description: item.description,
      dueDate,
    };
  });

  await PregnancyReminder.insertMany(reminders);
};

module.exports = {
  generatePregnancyReminders,
};