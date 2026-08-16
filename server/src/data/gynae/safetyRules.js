const evaluateSafety = (category, answers) => {
  const redFlags = [];

  // MISSED / IRREGULAR PERIOD
 

  if (category === "missed_period") {

    // Severe pelvic / abdominal pain
    if (
      ["severe", "very_severe"].includes(
        answers.severe_pain
      )
    ) {
      redFlags.push(
        "Severe pelvic or abdominal pain requires prompt medical evaluation."
      );
    }

    // Heavy bleeding


    if (
      ["heavy", "very_heavy"].includes(
        answers.heavy_bleeding
      )
    ) {
      redFlags.push(
        "Heavy or unusually heavy bleeding should be evaluated by a healthcare professional."
      );
    }


    // Possible pregnancy + severe pain
  

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

    // Dizziness / fainting
 

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

  // PELVIC PAIN


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


  // VAGINAL DISCHARGE


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


  // PAINFUL PERIOD


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

  // ABNORMAL BLEEDING

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


  // URINARY SYMPTOMS


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
  // RISK LEVEL
  // ======================================================

  let riskLevel = "low";

  // High-risk situations
  if (redFlags.length > 0) {
    riskLevel = "high";
  }

  // Medium-risk situations


  if (riskLevel === "low") {
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
      ["moderate"].includes(
        answers.heavy_bleeding
      )
    ) {
      riskLevel = "medium";
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