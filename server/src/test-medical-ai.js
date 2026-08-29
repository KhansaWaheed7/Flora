require("dotenv").config();

const MedicalAIUtil = require("./utils/medicalAIUtil");

async function test() {
  const report = `
  Liver Function Test

  Serum Bilirubin Total 1.9 mg/dL
  Serum Bilirubin Direct 0.5 mg/dL
  Serum Bilirubin Indirect 1.4 mg/dL
  SGPT (ALT) 78.32 U/L
  SGOT (AST) 52.65 U/L
  Alkaline Phosphatase 110.64 U/L
  Total Protein 6.73 g/dL
  Albumin 4.37 g/dL 3.5-5 g/dL
  Globulin 2.36 g/dL
  Albumin/Globulin Ratio 1.85
  `;

  try {
    const result = await MedicalAIUtil.analyzeReport(report);

    console.log(
      JSON.stringify(result, null, 2)
    );
  } catch (error) {
    console.error("AI TEST FAILED:", error);
  }
}

test();