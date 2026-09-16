const evaluateSafety = (category, answers = {}) => {
  const redFlags = [];

  // ======================================================
  // MISSED PERIOD
  // ======================================================

  if (category === "missed_period") {
    if (
      ["severe", "very_severe"].includes(
        answers.severe_pain
      )
    ) {
      redFlags.push(
        "Severe pelvic or abdominal pain requires prompt medical evaluation."
      );
    }

    if (
      ["heavy", "very_heavy"].includes(
        answers.heavy_bleeding
      )
    ) {
      redFlags.push(
        "Heavy or unusually heavy bleeding should be evaluated by a healthcare professional."
      );
    }

    if (
      ["yes", "not_sure"].includes(
        answers.pregnancy_possibility
      ) &&
      ["severe", "very_severe"].includes(
        answers.severe_pain
      )
    ) {
      redFlags.push(
        "Possible pregnancy combined with severe pelvic pain requires urgent medical evaluation."
      );
    }

    if (
      ["yes", "sometimes"].includes(
        answers.dizziness_or_fainting
      )
    ) {
      redFlags.push(
        "Severe dizziness, fainting, or unusual weakness requires medical evaluation."
      );
    }
  }

  // ======================================================
  // PELVIC PAIN
  // ======================================================

  if (category === "pelvic_pain") {
    if (
      ["severe", "very_severe"].includes(
        answers.pain_severity
      )
    ) {
      redFlags.push(
        "Severe pelvic pain requires prompt medical evaluation."
      );
    }

    if (answers.fever === "yes") {
      redFlags.push(
        "Pelvic pain accompanied by fever or chills should be medically evaluated."
      );
    }

    if (answers.heavy_bleeding === "yes") {
      redFlags.push(
        "Pelvic pain with unusual or heavy bleeding requires medical evaluation."
      );
    }

    if (
      ["yes", "sometimes"].includes(
        answers.fainting
      )
    ) {
      redFlags.push(
        "Fainting or severe dizziness with pelvic pain requires prompt medical evaluation."
      );
    }

    if (
      ["yes", "not_sure"].includes(
        answers.pregnancy_possibility
      ) &&
      ["severe", "very_severe"].includes(
        answers.pain_severity
      )
    ) {
      redFlags.push(
        "Possible pregnancy combined with severe pelvic pain requires urgent medical evaluation."
      );
    }
  }

  // ======================================================
  // VAGINAL DISCHARGE
  // ======================================================

  if (category === "vaginal_discharge") {
    if (
      ["yellow", "green", "grey"].includes(
        answers.discharge_color
      ) &&
      answers.unusual_odor === "yes"
    ) {
      redFlags.push(
        "Unusual discharge with a strong odor should be evaluated by a healthcare professional."
      );
    }

    if (
      answers.pain === "yes" &&
      answers.fever === "yes"
    ) {
      redFlags.push(
        "Vaginal symptoms accompanied by pelvic pain and fever require medical evaluation."
      );
    }

    if (
      ["moderate", "severe"].includes(
        answers.itching
      )
    ) {
      redFlags.push(
        "Persistent or significant itching and irritation should be evaluated."
      );
    }
  }

  // ======================================================
  // PAINFUL PERIOD
  // ======================================================

  if (category === "painful_period") {
    if (
      ["severe", "very_severe"].includes(
        answers.pain_severity
      )
    ) {
      redFlags.push(
        "Severe period pain, especially if unusual for you, should be medically evaluated."
      );
    }

    if (
      ["heavy", "very_heavy"].includes(
        answers.heavy_bleeding
      )
    ) {
      redFlags.push(
        "Very heavy menstrual bleeding should be medically evaluated."
      );
    }

    if (
      ["yes", "sometimes"].includes(
        answers.fainting
      )
    ) {
      redFlags.push(
        "Fainting or severe dizziness during menstruation requires medical evaluation."
      );
    }

    if (
      ["significantly", "completely"].includes(
        answers.daily_activities
      )
    ) {
      redFlags.push(
        "Period pain that significantly interferes with daily activities should be discussed with a healthcare professional."
      );
    }
  }

  // ======================================================
  // ABNORMAL BLEEDING
  // ======================================================

  if (category === "abnormal_bleeding") {
    if (
      ["heavy", "very_heavy"].includes(
        answers.heavy_bleeding
      )
    ) {
      redFlags.push(
        "Heavy or very heavy bleeding requires medical evaluation."
      );
    }

    if (
      ["severe", "very_severe"].includes(
        answers.severe_pain
      )
    ) {
      redFlags.push(
        "Abnormal bleeding accompanied by severe pelvic pain requires prompt medical evaluation."
      );
    }

    if (
      ["yes", "sometimes"].includes(
        answers.dizziness
      )
    ) {
      redFlags.push(
        "Significant dizziness or fainting with abnormal bleeding requires prompt medical evaluation."
      );
    }

    if (
      ["yes", "not_sure"].includes(
        answers.pregnancy_possibility
      )
    ) {
      redFlags.push(
        "Unusual bleeding when pregnancy is possible should be evaluated by a healthcare professional."
      );
    }
  }

  // ======================================================
  // URINARY SYMPTOMS
  // ======================================================

  if (category === "urinary_symptoms") {
    if (answers.blood_in_urine === "yes") {
      redFlags.push(
        "Blood in the urine should be evaluated by a healthcare professional."
      );
    }

    if (
      answers.fever === "yes" &&
      answers.back_or_side_pain === "yes"
    ) {
      redFlags.push(
        "Urinary symptoms with fever and significant back or side pain require prompt medical evaluation."
      );
    }
  }

  // ======================================================
  // PREGNANCY CONCERN
  // ======================================================

  if (category === "pregnancy_concern") {
    if (
      ["severe", "very_severe"].includes(
        answers.pelvic_pain
      )
    ) {
      redFlags.push(
        "Severe pelvic or abdominal pain when pregnancy is possible requires urgent medical evaluation."
      );
    }

    if (
      ["heavy", "very_heavy"].includes(
        answers.bleeding
      )
    ) {
      redFlags.push(
        "Heavy bleeding when pregnancy is possible should be evaluated promptly."
      );
    }
  }

  // ======================================================
  // RISK LEVEL
  // ======================================================

  let riskLevel = "low";

  if (redFlags.length > 0) {
    riskLevel = "high";
  } else {
    if (category === "missed_period") {
      if (
        ["8_14", "15_30", "more_than_30"].includes(
          answers.days_late
        ) ||
        ["sometimes", "often", "almost_always"].includes(
          answers.previous_irregular
        ) ||
        ["mild", "moderate"].includes(
          answers.severe_pain
        ) ||
        answers.heavy_bleeding === "moderate"
      ) {
        riskLevel = "medium";
      }
    }

    if (category === "pelvic_pain") {
      if (
        ["moderate"].includes(
          answers.pain_severity
        ) ||
        answers.fever === "not_sure" ||
        answers.heavy_bleeding === "not_sure"
      ) {
        riskLevel = "medium";
      }
    }

    if (category === "vaginal_discharge") {
      if (
        ["yellow", "green", "grey"].includes(
          answers.discharge_color
        ) ||
        ["moderate", "severe"].includes(
          answers.itching
        ) ||
        answers.unusual_odor === "yes"
      ) {
        riskLevel = "medium";
      }
    }

    if (category === "painful_period") {
      if (
        answers.pain_severity === "moderate" ||
        ["moderate", "heavy"].includes(
          answers.heavy_bleeding
        ) ||
        ["significantly"].includes(
          answers.daily_activities
        )
      ) {
        riskLevel = "medium";
      }
    }

    if (category === "abnormal_bleeding") {
      if (
        ["moderate", "heavy"].includes(
          answers.heavy_bleeding
        ) ||
        answers.between_periods === "yes" ||
        answers.after_sex === "yes"
      ) {
        riskLevel = "medium";
      }
    }

    if (category === "urinary_symptoms") {
      if (
        ["sometimes", "often"].includes(
          answers.burning
        ) ||
        ["sometimes", "often"].includes(
          answers.frequency
        ) ||
        ["sometimes", "often"].includes(
          answers.urgency
        )
      ) {
        riskLevel = "medium";
      }
    }

    if (category === "pregnancy_concern") {
      if (
        answers.pregnancy_possibility === "yes" ||
        answers.pregnancy_possibility === "not_sure"
      ) {
        riskLevel = "medium";
      }
    }
  }

  return {
    riskLevel,
    redFlags,
  };
};

module.exports = {
  evaluateSafety,
};