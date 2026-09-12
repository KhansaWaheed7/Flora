const PregnancyReminder = require("../models/PregnancyReminder");

const reminders = [
  { week: 6, title: "Viability Scan" },
  { week: 12, title: "NT Scan" },
  { week: 20, title: "Anomaly Scan" },
  { week: 26, title: "OGTT Test" },
  { week: 32, title: "Growth Scan" },
  { week: 36, title: "Weekly Antenatal Visit" },
  { week: 38, title: "Delivery Preparation" },
];

const generatePregnancyReminders = async (pregnancyId) => {

  const existing = await PregnancyReminder.countDocuments({
  pregnancy: pregnancyId,
});

if (existing > 0) {
  return;
}
  const docs = reminders.map((reminder) => ({
    pregnancy: pregnancyId,
    week: reminder.week,
    title: reminder.title,
  }));

  await PregnancyReminder.insertMany(docs);

  return docs;
};

module.exports = generatePregnancyReminders;