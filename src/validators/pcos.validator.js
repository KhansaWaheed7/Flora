const { body } = require("express-validator");

exports.createPCOSAssessmentValidator = [

  body("age")
    .isInt({ min: 10, max: 60 })
    .withMessage("Age must be between 10 and 60"),

  body("bmi")
    .isFloat({ min: 10, max: 60 })
    .withMessage("BMI must be between 10 and 60"),

  body("cycleLength")
    .isInt({ min: 15, max: 90 })
    .withMessage("Cycle length must be between 15 and 90 days"),

  body("irregularPeriods")
    .isBoolean()
    .withMessage("Irregular periods must be true or false"),

  body("weightGain")
    .isBoolean()
    .withMessage("Weight gain must be true or false"),

  body("acne")
    .isBoolean()
    .withMessage("Acne must be true or false"),

  body("hairLoss")
    .isBoolean()
    .withMessage("Hair loss must be true or false"),

  body("excessiveHairGrowth")
    .isBoolean()
    .withMessage("Excessive hair growth must be true or false"),

  body("darkSkinPatches")
    .isBoolean()
    .withMessage("Dark skin patches must be true or false"),


  body("exerciseFrequency")
    .isInt({ min: 0, max: 7 })
    .withMessage("Exercise frequency must be between 0 and 7"),

    body("fastFood")
  .isBoolean()
  .withMessage("Fast food must be true or false"),
  

];