const medicalReferences = [
  {
    test: "hemoglobin",
    aliases: ["hb", "haemoglobin"],
    category: "blood",
    information:
      "Hemoglobin is the protein in red blood cells that carries oxygen. Adult female reference ranges commonly fall around 12.0-15.5 g/dL, but laboratory-specific ranges should be preferred.",
    referenceRange: "12.0-15.5 g/dL",
  },

  {
    test: "hematocrit",
    aliases: ["hct", "packed cell volume", "pcv"],
    category: "blood",
    information:
      "Hematocrit measures the percentage of blood volume occupied by red blood cells. Adult female reference ranges commonly fall around 36-46%.",
    referenceRange: "36-46%",
  },

  {
    test: "rbc",
    aliases: ["rbc count", "red blood cell count", "red blood cells"],
    category: "blood",
    information:
      "RBC count measures the number of red blood cells in blood. Adult female reference ranges commonly fall around 3.8-5.2 million/µL.",
    referenceRange: "3.8-5.2 million/µL",
  },

  {
    test: "wbc",
    aliases: [
      "wbc count",
      "white blood cell count",
      "white blood cells",
      "leukocyte count",
    ],
    category: "blood",
    information:
      "WBC count measures white blood cells, which are involved in immune function.",
    referenceRange: "4,000-11,000 /µL",
  },

  {
    test: "platelets",
    aliases: ["platelet count", "plt"],
    category: "blood",
    information:
      "Platelets help blood clot. Platelet count is commonly interpreted using a reference range around 150,000-450,000/µL.",
    referenceRange: "150,000-450,000 /µL",
  },

  {
    test: "glucose",
    aliases: ["blood glucose", "fasting glucose", "blood sugar"],
    category: "metabolic",
    information:
      "Blood glucose measures the amount of glucose in the blood. Interpretation depends on whether the sample was fasting, random, or taken under another testing condition.",
    referenceRange: "Fasting values commonly 70-99 mg/dL",
  },

  {
    test: "total cholesterol",
    aliases: ["cholesterol", "serum cholesterol"],
    category: "lipid",
    information:
      "Total cholesterol is used as part of cardiovascular risk assessment. A commonly used desirable level is below 200 mg/dL.",
    referenceRange: "<200 mg/dL",
  },

  {
    test: "ldl cholesterol",
    aliases: ["ldl", "low density lipoprotein"],
    category: "lipid",
    information:
      "LDL cholesterol is commonly called 'bad' cholesterol and is evaluated as part of cardiovascular risk assessment. Optimal targets depend on overall cardiovascular risk.",
    referenceRange: "<100 mg/dL commonly considered optimal",
  },

  {
    test: "hdl cholesterol",
    aliases: ["hdl", "high density lipoprotein"],
    category: "lipid",
    information:
      "HDL cholesterol is commonly called 'good' cholesterol. Higher levels are generally considered favorable, although interpretation depends on the overall clinical context.",
    referenceRange: "Female values ≥50 mg/dL are commonly considered favorable",
  },

  {
    test: "triglycerides",
    aliases: ["tg", "triglyceride"],
    category: "lipid",
    information:
      "Triglycerides are a type of fat measured in blood and are used in cardiovascular and metabolic risk assessment.",
    referenceRange: "<150 mg/dL",
  },

  {
    test: "creatinine",
    aliases: ["serum creatinine"],
    category: "kidney",
    information:
      "Creatinine is a waste product used to help evaluate kidney function. Interpretation should consider age, sex, muscle mass and estimated GFR.",
    referenceRange: "Approximately 0.5-1.1 mg/dL for many adult females",
  },

  {
    test: "albumin",
    aliases: ["serum albumin"],
    category: "liver",
    information:
      "Albumin is a protein produced primarily by the liver. It helps maintain fluid balance and can be affected by liver, kidney, nutritional and other conditions.",
    referenceRange: "3.5-5.0 g/dL",
  },

  {
    test: "bilirubin total",
    aliases: [
      "total bilirubin",
      "serum bilirubin total",
      "bilirubin",
    ],
    category: "liver",
    information:
      "Total bilirubin measures bilirubin in the blood. It is commonly interpreted together with direct and indirect bilirubin and other liver-related tests.",
    referenceRange: "Approximately 0.1-1.2 mg/dL",
  },

  {
    test: "bilirubin direct",
    aliases: [
      "direct bilirubin",
      "conjugated bilirubin",
      "serum bilirubin direct",
    ],
    category: "liver",
    information:
      "Direct bilirubin represents conjugated bilirubin processed by the liver.",
    referenceRange: "Approximately 0.0-0.3 mg/dL",
  },

  {
    test: "bilirubin indirect",
    aliases: [
      "indirect bilirubin",
      "unconjugated bilirubin",
      "serum bilirubin indirect",
    ],
    category: "liver",
    information:
      "Indirect bilirubin represents unconjugated bilirubin before liver processing.",
    referenceRange: "Approximately 0.2-0.9 mg/dL",
  },

  {
    test: "alt",
    aliases: [
      "sgpt",
      "sgpt alt",
      "alanine aminotransferase",
      "alanine transaminase",
    ],
    category: "liver",
    information:
      "ALT/SGPT is an enzyme found primarily in the liver. Elevated values can occur with liver cell injury or other conditions and should be interpreted with other findings.",
    referenceRange: "Laboratory-specific; commonly approximately 7-35 U/L for adult females",
  },

  {
    test: "ast",
    aliases: [
      "sgot",
      "sgot ast",
      "aspartate aminotransferase",
      "aspartate transaminase",
    ],
    category: "liver",
    information:
      "AST/SGOT is an enzyme found in the liver and other tissues. Elevated values can have multiple causes and should be interpreted with other findings.",
    referenceRange: "Laboratory-specific; commonly approximately 8-35 U/L for adult females",
  },

  {
    test: "alkaline phosphatase",
    aliases: ["alp", "serum alkaline phosphatase"],
    category: "liver",
    information:
      "Alkaline phosphatase is an enzyme associated with the liver, bile ducts and bones.",
    referenceRange: "Laboratory-specific; commonly approximately 40-120 U/L",
  },

  {
    test: "tsh",
    aliases: [
      "thyroid stimulating hormone",
      "thyroid-stimulating hormone",
    ],
    category: "thyroid",
    information:
      "TSH is a hormone used to evaluate thyroid function. It is generally interpreted together with free T4 and sometimes other thyroid tests.",
    referenceRange: "Approximately 0.4-4.0 mIU/L",
  },

  {
    test: "total protein",
    aliases: ["serum total protein", "total serum protein"],
    category: "liver",
    information:
      "Total protein measures the combined amount of albumin and globulins in blood.",
    referenceRange: "Approximately 6.0-8.3 g/dL",
  },

  {
    test: "globulin",
    aliases: ["serum globulin"],
    category: "liver",
    information:
      "Globulins are a group of proteins involved in immune function and transport.",
    referenceRange: "Approximately 2.0-3.5 g/dL",
  },

  {
    test: "albumin/globulin ratio",
    aliases: ["a/g ratio", "ag ratio", "albumin globulin ratio"],
    category: "liver",
    information:
      "The albumin/globulin ratio compares albumin concentration with globulin concentration.",
    referenceRange: "Approximately 1.0-2.5",
  },

  {
    test: "ferritin",
    aliases: ["serum ferritin"],
    category: "iron",
    information:
      "Ferritin reflects stored iron in the body. Low ferritin can indicate depleted iron stores, while elevated ferritin can have multiple causes.",
    referenceRange: "Laboratory-specific; commonly approximately 15-150 ng/mL for adult females",
  },

  {
    test: "serum iron",
    aliases: ["iron", "serum fe"],
    category: "iron",
    information:
      "Serum iron measures iron circulating in the blood. It is best interpreted with ferritin, transferrin or TIBC and transferrin saturation.",
    referenceRange: "Laboratory-specific; commonly approximately 50-170 µg/dL",
  },

  {
    test: "transferrin saturation",
    aliases: ["tsat", "transferrin saturation percentage"],
    category: "iron",
    information:
      "Transferrin saturation estimates the percentage of transferrin binding sites occupied by iron.",
    referenceRange: "Approximately 20-50%",
  },
];

module.exports = medicalReferences;