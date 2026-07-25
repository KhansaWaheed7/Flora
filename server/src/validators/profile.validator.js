const { body } = require("express-validator");

exports.updateProfileValidation = [
  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Invalid date of birth"),

  body("gender")
    .optional()
    .isIn(["Female", "Male", "Prefer not to say"])
    .withMessage("Invalid gender"),

  body("bloodGroup")
    .optional()
    .isIn([
      "A+",
      "A-",
      "B+",
      "B-",
      "AB+",
      "AB-",
      "O+",
      "O-",
    ])
    .withMessage("Invalid blood group"),

  body("height")
    .optional()
    .isFloat({ min: 50, max: 250 })
    .withMessage("Height must be between 50 and 250 cm"),

  body("weight")
    .optional()
    .isFloat({ min: 20, max: 300 })
    .withMessage("Weight must be between 20 and 300 kg"),
];