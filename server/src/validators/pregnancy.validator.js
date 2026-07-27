const { body } = require("express-validator");

exports.createPregnancyValidator = [
  body("lastPeriodDate")
    .notEmpty()
    .withMessage("Last period date is required")
    .isISO8601()
    .withMessage("Invalid date format"),
];

exports.updatePregnancyValidator = [
  body("lastPeriodDate")
    .notEmpty()
    .withMessage("Last period date is required")
    .isISO8601()
    .withMessage("Invalid date format"),
];