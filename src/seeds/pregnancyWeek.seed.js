require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("../config/database");

const PregnancyWeek = require("../models/PregnancyWeek");


const pregnancyWeeks = [
  {
    week: 1,
    babySize: "Poppy Seed",
    babyWeight: "<1 g",
    babyLength: "0.1 cm",
    babyDevelopment:
      "Fertilization occurs and the embryo begins forming.",
    motherChanges:
      "Most women don't notice pregnancy yet.",
    checklist: [
      "Start folic acid",
      "Avoid alcohol",
      "Quit smoking",
    ],
    warningSigns: [
      "Heavy bleeding",
      "Severe abdominal pain",
    ],
    nutritionTips: [
      "Eat leafy vegetables",
      "Increase water intake",
    ],
  },

  {
    week: 2,
    babySize: "Sesame Seed",
    babyWeight: "<1 g",
    babyLength: "0.2 cm",
    babyDevelopment:
      "The embryo implants into the uterus.",
    motherChanges:
      "Hormonal changes begin.",
    checklist: [
      "Take prenatal vitamins",
      "Stay hydrated",
      "Get enough sleep",
    ],
    warningSigns: [
      "Heavy bleeding",
      "Severe cramping",
    ],
    nutritionTips: [
      "Protein-rich foods",
      "Fresh fruits",
    ],
  },

  {
    week: 3,
    babySize: "Peppercorn",
    babyWeight: "1 g",
    babyLength: "0.3 cm",
    babyDevelopment:
      "The neural tube starts forming.",
    motherChanges:
      "Breast tenderness may begin.",
    checklist: [
      "Book first prenatal appointment",
      "Avoid raw meat",
      "Exercise lightly",
    ],
    warningSigns: [
      "Persistent pain",
      "Heavy bleeding",
    ],
    nutritionTips: [
      "Iron-rich foods",
      "Folic acid",
    ],
  },
];
const seedPregnancyWeeks = async () => {
  try {
    await PregnancyWeek.deleteMany();

    await PregnancyWeek.insertMany(pregnancyWeeks);

    console.log("✅ Pregnancy week data seeded successfully");

    process.exit();
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

connectDB().then(() => {
  seedPregnancyWeeks();
});