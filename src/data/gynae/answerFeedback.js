const ANSWER_FEEDBACK = {
  // ======================================================
  // MISSED / IRREGULAR PERIOD
  // ======================================================

  missed_period: {
    days_late: {
      more_than_30:
        "A delay of more than 30 days is worth looking into because menstrual changes can have several possible causes. I’ll check your usual cycle pattern first.",

      "15_30":
        "A delay of 15–30 days can happen for several reasons, including stress, hormonal changes, lifestyle changes, or pregnancy. Let’s first look at whether your periods have been irregular before.",

      "8_14":
        "An 8–14 day delay can happen occasionally, but it is useful to look at your usual cycle pattern and other factors. Let’s check whether your periods have been irregular before.",

      "4_7":
        "A delay of a few days can sometimes happen without indicating a serious problem. I’ll check your usual cycle pattern and a few other factors to understand it better.",

      "1_3":
        "A short delay of 1–3 days is fairly common and can sometimes be related to normal cycle variation, stress, or lifestyle changes. Let’s look at your usual cycle pattern next.",

      not_sure:
        "That’s okay. We can still assess the situation using your other symptoms and cycle information. Let’s start by looking at how regular your periods usually are.",
    },

    previous_irregular: {
      never:
        "If your periods are usually regular, this delay is a change from your normal pattern. Let’s check a few common factors that can temporarily affect the menstrual cycle.",

      rarely:
        "Occasional irregularity can happen, but your usual pattern is still useful for understanding this delay. Let’s check whether pregnancy could be a possibility.",

      sometimes:
        "Since you’ve experienced some irregularity before, that may be relevant to your current delay. Let’s also check whether pregnancy could be a possibility.",

      often:
        "Frequent irregular periods are important to consider because they can sometimes be associated with hormonal or other underlying factors. Let’s check whether pregnancy could be a possibility as well.",

      almost_always:
        "If your periods are almost always irregular, the current delay may be part of a longer-term pattern. Let’s check pregnancy possibility and then look at other factors that can affect your cycle.",
    },

    pregnancy_possibility: {
      yes:
        "Pregnancy is one possibility when a period is delayed, so we’ll keep that in mind while reviewing the rest of your answers. Next, let’s look at recent stress or lifestyle changes.",

      not_sure:
        "That’s okay. Since pregnancy cannot be ruled out from this answer, we’ll keep it in mind while reviewing the other factors. Next, let’s look at recent stress or lifestyle changes.",

      no:
        "That makes pregnancy less likely based on what you’ve shared. We can now focus on other factors that may affect your cycle, starting with recent stress or lifestyle changes.",

      prefer_not_to_say:
        "That’s completely okay. We can continue without this information and focus on the other factors that may affect your cycle. Let’s look at recent stress or lifestyle changes.",
    },

    stress_or_lifestyle_change: {
      none:
        "Since there haven’t been significant recent changes, we’ll look at other possible contributors to the delayed period. Next, I’ll check for symptoms that can sometimes occur alongside hormonal changes.",

      mild:
        "Even mild changes in stress, sleep, exercise, diet, or routine can sometimes affect menstrual timing. We’ll consider that alongside your other answers. Next, let’s check for some related symptoms.",

      moderate:
        "Moderate stress or lifestyle changes can sometimes affect when a period arrives. We’ll consider this together with your other symptoms. Next, let’s check for signs of hormonal changes.",

      significant:
        "Significant stress or lifestyle changes can sometimes disrupt the menstrual cycle. This may be relevant to your delay, but we’ll also check for other factors before drawing conclusions. Next, let’s look at related symptoms.",
    },

    pcos_symptoms: {
      acne:
        "Persistent acne can sometimes occur alongside hormonal changes. It does not by itself indicate a specific condition, so we’ll consider it together with your other answers. Next, let’s check for pelvic or abdominal pain.",

      facial_body_hair:
        "Increased facial or body hair can sometimes occur with hormonal changes. It is only one piece of information, so we’ll consider it alongside your other answers. Next, let’s check for pelvic or abdominal pain.",

      weight_changes:
        "Unusual weight changes can sometimes affect menstrual cycles and may also occur alongside hormonal changes. We’ll consider this with the rest of your answers. Next, let’s check for pelvic or abdominal pain.",

      hair_thinning:
        "Hair thinning can sometimes occur alongside hormonal changes. It does not identify a specific cause on its own, so we’ll consider it with your other answers. Next, let’s check for pelvic or abdominal pain.",

      none:
        "You haven’t noticed those symptoms, which is useful information. We’ll continue checking other factors that can be relevant to a delayed period. Next, let’s look at pelvic or abdominal pain.",

      default:
        "Those symptoms may provide useful context when looking at menstrual changes. I’ll consider them together rather than treating any single symptom as a diagnosis. Next, let’s check for pelvic or abdominal pain.",
    },

    severe_pain: {
      severe:
        "Severe pelvic or abdominal pain is an important warning sign, particularly when a period is delayed. I’ll check your bleeding next so we can look for additional warning signs.",

      very_severe:
        "Very severe pelvic or abdominal pain needs careful attention, especially with a delayed period. I’ll check your bleeding next for any additional warning signs.",

      moderate:
        "Moderate pain is useful to consider alongside the delayed period. Let’s check your bleeding next to see whether there are any additional concerns.",

      mild:
        "Mild pain can have several possible causes and does not identify a specific condition by itself. Let’s check your bleeding next.",

      none:
        "The absence of pelvic or abdominal pain is useful information. Let’s continue by checking whether you’re experiencing unusual bleeding.",
    },

    heavy_bleeding: {
      heavy:
        "Heavy bleeding together with a delayed period is important to evaluate. I’ll check for symptoms such as dizziness or fainting next because they can help identify whether there are warning signs.",

      very_heavy:
        "Very heavy bleeding can require prompt medical evaluation, especially when combined with other symptoms. I’ll check for dizziness, fainting, or unusual weakness next.",

      moderate:
        "Moderate bleeding is useful to consider alongside the rest of your symptoms. Let’s check whether you’ve experienced dizziness, fainting, or unusual weakness.",

      light:
        "Light bleeding can occur for several reasons and needs to be considered with the rest of the picture. Let’s check for dizziness, fainting, or unusual weakness next.",

      none:
        "There is no unusual bleeding based on your answer. Let’s check for dizziness, fainting, or unusual weakness before we complete this part of the assessment.",
    },

    dizziness_or_fainting: {
      yes:
        "Dizziness, fainting, or unusual weakness can be important warning signs, particularly when bleeding is also present. I’ll keep this information in the safety assessment. Next, I’ll check whether you’re breastfeeding.",

      sometimes:
        "Occasional dizziness or weakness is important to consider alongside your other symptoms. I’ll keep it in the safety assessment. Next, let’s check whether you’re breastfeeding.",

      no:
        "The absence of dizziness or fainting is reassuring from a safety perspective. Let’s check whether breastfeeding could be affecting your menstrual cycle.",

      not_sure:
        "That’s okay. We’ll keep this uncertainty in mind rather than assuming either way. Next, let’s check whether you’re breastfeeding.",
    },

    breastfeeding: {
      yes:
        "Breastfeeding can naturally affect menstrual timing and regularity. We’ll consider this when interpreting your delayed period. One final factor to check is whether you’ve recently changed hormonal medication or contraception.",

      no:
        "Breastfeeding does not appear to be a factor based on your answer. Let’s check one final factor: recent changes to hormonal medication or contraception.",

      not_sure:
        "That’s okay. We can continue without assuming. One final factor I’ll check is whether you’ve recently changed hormonal medication or contraception.",

      prefer_not_to_say:
        "That’s completely okay. We can continue without this information. One final factor I’ll check is whether you’ve recently changed hormonal medication or contraception.",
    },

    medication_or_contraception: {
      yes:
        "Recent changes to hormonal medication or contraception can affect menstrual timing. I’ll include that in the assessment. We’ve now covered the main factors I wanted to check.",

      no:
        "Recent hormonal medication or contraception changes do not appear to be a factor based on your answer. We’ve now covered the main factors I wanted to check.",

      not_sure:
        "That’s okay. We’ll keep this factor uncertain rather than making an assumption. We’ve now covered the main factors I wanted to check.",

      prefer_not_to_say:
        "That’s completely okay. We can complete the assessment without this information. We’ve now covered the main factors I wanted to check.",
    },
  },

  // ======================================================
  // PELVIC PAIN
  // ======================================================

  pelvic_pain: {
    pain_location: {
      lower_abdomen:
        "Pain in the lower abdomen can have several possible causes. Location alone cannot tell us the cause, so I’ll look at the severity and other symptoms next.",

      pelvis:
        "Pain in the pelvic area can have several possible causes. I’ll look at how severe the pain is and whether other symptoms are present.",

      one_side:
        "One-sided pelvic pain is important to note because the location can help provide context. I’ll check the severity next.",

      lower_back:
        "Lower-back pain can sometimes occur alongside pelvic symptoms. I’ll consider it together with your other answers and check the severity next.",

      multiple_areas:
        "Pain affecting several areas is useful to note. I’ll look at the severity and duration next to get a clearer picture.",

      other:
        "That location is useful information. I’ll use your other answers, especially the severity and duration, to understand the symptoms better.",

      default:
        "The location of the pain helps provide context, but it cannot identify the cause by itself. Let’s check how severe the pain is next.",
    },

    pain_severity: {
      severe:
        "Severe pelvic pain is an important warning sign. I’ll check how long you’ve had the pain and then look for other symptoms that could indicate a need for medical evaluation.",

      very_severe:
        "Very severe pelvic pain needs careful attention and may require prompt medical evaluation. I’ll check the duration and other warning signs next.",

      moderate:
        "Moderate pelvic pain can have several possible causes. Let’s look at how long it has been present and whether other symptoms are occurring.",

      mild:
        "Mild pelvic pain can occur for many reasons. I’ll look at its duration and other symptoms before drawing any conclusions.",

      none:
        "There is no significant pain based on your answer. Let’s continue with the duration and other symptoms you may be experiencing.",
    },

    pain_duration: {
      less_than_24h:
        "Since the pain started recently, its progression and accompanying symptoms are particularly useful to consider. Next, I’ll check for fever or chills.",

      "1_3_days":
        "Pain lasting 1–3 days is useful to note. I’ll check for fever or chills next because they can provide additional context.",

      "4_7_days":
        "Pain lasting several days is important to consider. Let’s check whether you have fever or chills as well.",

      more_than_week:
        "Pain lasting more than a week should be considered carefully, particularly if it persists or worsens. I’ll check for fever or chills next.",

      recurring:
        "Recurring pain is useful information because the pattern can help a healthcare professional understand the concern. Let’s check for fever or chills next.",

      default:
        "The duration of the pain provides useful context. Let’s check for fever or chills next.",
    },

    fever: {
      yes:
        "Fever or chills together with pelvic pain can be an important warning sign. I’ll also check whether there is unusual or heavy bleeding.",

      no:
        "There is no fever or chills based on your answer. Let’s check whether you’re experiencing unusual or heavy bleeding.",

      not_sure:
        "That’s okay. We won’t assume either way. Let’s check whether you’re experiencing unusual or heavy bleeding.",
    },

    heavy_bleeding: {
      yes:
        "Pelvic pain together with unusual or heavy bleeding is important to evaluate. I’ll check for dizziness or fainting next.",

      no:
        "There is no unusual or heavy bleeding based on your answer. Let’s check for dizziness or fainting next.",

      not_sure:
        "That’s okay. We’ll keep this uncertain and continue checking for other warning signs. Next, let’s look at dizziness or fainting.",
    },

    fainting: {
      yes:
        "Fainting or severe dizziness together with pelvic pain can be a warning sign requiring prompt medical evaluation. I’ll keep this in the safety assessment. Next, I’ll check whether pregnancy could be possible.",

      sometimes:
        "Occasional severe dizziness or weakness is important to consider with pelvic pain. I’ll keep it in the safety assessment. Next, let’s check pregnancy possibility.",

      no:
        "There is no fainting or severe dizziness based on your answer. Let’s check whether pregnancy could be possible.",

      default:
        "This information helps complete the safety picture. Let’s check whether pregnancy could be possible.",
    },

    pregnancy_possibility: {
      yes:
        "Possible pregnancy is important to consider when pelvic pain is present, particularly if the pain is severe. We’ve now covered the main warning signs in this assessment.",

      not_sure:
        "That’s okay. We’ll keep pregnancy possibility uncertain rather than making an assumption. We’ve now covered the main warning signs in this assessment.",

      no:
        "Pregnancy is less likely based on your answer. We’ve now covered the main warning signs in this assessment.",

      prefer_not_to_say:
        "That’s completely okay. We can complete the assessment without this information. We’ve now covered the main warning signs.",
    },
  },

  // ======================================================
  // VAGINAL DISCHARGE
  // ======================================================

  vaginal_discharge: {
    discharge_color: {
      default:
        "Discharge color can vary naturally, but changes such as yellow, green, or grey discharge may be worth evaluating depending on the other symptoms. Let’s check the consistency next.",
    },

    discharge_consistency: {
      default:
        "The consistency gives us another useful piece of information. I’ll consider it together with the color and other symptoms. Next, let’s check the odor.",
    },

    unusual_odor: {
      yes:
        "A strong or unusual odor can be relevant when assessing changes in vaginal discharge. I’ll check for itching or irritation next.",

      no:
        "The absence of an unusual odor is useful information. Let’s check whether there is any itching or irritation.",

      not_sure:
        "That’s okay. We’ll keep this uncertain. Next, let’s check for itching or irritation.",
    },

    itching: {
      moderate:
        "Moderate itching or irritation can be important when assessing unusual discharge. I’ll also check whether there is pelvic pain or pain during urination.",

      severe:
        "Significant itching or irritation deserves attention, especially if it persists. Let’s check whether you also have pelvic pain or pain during urination.",

      mild:
        "Mild irritation provides useful context. Let’s check whether you have pelvic pain or pain during urination.",

      none:
        "There is no itching or irritation based on your answer. Let’s check for pelvic pain or pain during urination next.",

      default:
        "The level of irritation helps provide context. Let’s check for pelvic pain or pain during urination next.",
    },

    pain: {
      yes:
        "Pelvic pain or pain during urination alongside unusual discharge is important to consider. I’ll check for fever or chills next.",

      no:
        "There is no pelvic pain or pain during urination based on your answer. Let’s check for fever or chills.",

      not_sure:
        "That’s okay. We’ll keep this uncertain. Let’s check for fever or chills next.",
    },

    fever: {
      yes:
        "Fever or chills together with vaginal symptoms can be a warning sign that deserves medical evaluation. I’ll check pregnancy possibility next.",

      no:
        "There is no fever or chills based on your answer. Let’s check whether pregnancy could be possible.",

      not_sure:
        "That’s okay. We won’t assume either way. Let’s check whether pregnancy could be possible.",
    },

    pregnancy_possibility: {
      yes:
        "Possible pregnancy is important to consider when evaluating vaginal symptoms. We’ve now covered the main factors in this assessment.",

      not_sure:
        "That’s okay. We’ll keep pregnancy possibility uncertain. We’ve now covered the main factors in this assessment.",

      no:
        "Pregnancy is less likely based on your answer. We’ve now covered the main factors in this assessment.",

      prefer_not_to_say:
        "That’s completely okay. We can complete the assessment without this information. We’ve now covered the main factors.",
    },
  },

  // ======================================================
  // PAINFUL PERIOD
  // ======================================================

  painful_period: {
    pain_severity: {
      severe:
        "Severe period pain deserves closer attention, especially if it is different from your usual experience. I’ll check how long the pain normally lasts next.",

      very_severe:
        "Very severe period pain should be taken seriously, particularly if it interferes with your normal activities. I’ll check the duration next.",

      mild:
        "Mild period pain is common, but the pattern and duration still help us understand your symptoms. Let’s check how long it usually lasts.",

      moderate:
        "Moderate period pain can have several possible explanations. Let’s look at how long it usually lasts and whether it is typical for you.",

      default:
        "The severity of the pain gives us useful context. Let’s check how long it usually lasts.",
    },

    pain_duration: {
      default:
        "The duration helps us understand whether the pain follows a typical pattern for you. Next, I’ll check whether this pain is similar to what you normally experience.",
    },

    usual_pattern: {
      yes:
        "If the pain is similar to your usual period pain, that is useful context. Let’s check your bleeding pattern next.",

      somewhat:
        "A change from your usual pain pattern is worth noting. Let’s check your bleeding pattern next.",

      no:
        "A significant change from your normal period pain is important to consider. Let’s check your bleeding pattern next.",
    },

    heavy_bleeding: {
      normal:
        "Your bleeding is normal for you based on your answer. Let’s check whether the pain has caused fainting or severe dizziness.",

      somewhat_heavy:
        "Somewhat heavier bleeding is useful to note alongside period pain. Let’s check whether you’ve experienced fainting or severe dizziness.",

      heavy:
        "Heavy bleeding alongside period pain is important to consider. I’ll check for fainting or severe dizziness next.",

      very_heavy:
        "Very heavy bleeding together with significant period pain deserves careful attention. I’ll check for fainting or severe dizziness next.",
    },

    fainting: {
      yes:
        "Fainting or severe dizziness during a period can be a warning sign, particularly with heavy bleeding or severe pain. I’ll keep this in the safety assessment. Next, let’s look at how much the pain affects your daily activities.",

      sometimes:
        "Occasional fainting or severe dizziness is important to consider with period pain. I’ll keep it in the safety assessment. Next, let’s look at how much the pain affects your daily activities.",

      no:
        "There is no fainting or severe dizziness based on your answer. Let’s check how much the pain affects your daily activities.",

      default:
        "This helps complete the safety picture. Let’s look at how much the pain affects your daily activities.",
    },

    daily_activities: {
      not_at_all:
        "The pain does not interfere with your normal activities. That is useful context when assessing how disruptive the symptoms are. We’ve now covered the main areas of this assessment.",

      slightly:
        "The pain has only a slight effect on your daily activities. We’ve now covered the main areas of this assessment.",

      moderately:
        "The pain has a moderate effect on your daily activities, which is useful information when assessing its impact. We’ve now covered the main areas of this assessment.",

      significantly:
        "Pain that significantly interferes with daily activities is important to discuss with a healthcare professional. We’ve now covered the main areas of this assessment.",

      completely:
        "Pain that prevents normal daily activities deserves medical attention. We’ve now covered the main areas of this assessment.",
    },
  },

  // ======================================================
  // ABNORMAL BLEEDING
  // ======================================================

  abnormal_bleeding: {
    bleeding_duration: {
      default:
        "The duration of unusual bleeding helps us understand the pattern. Let’s check how heavy the bleeding is next.",
    },

    heavy_bleeding: {
      light:
        "The bleeding is light based on your answer. Let’s check whether it is happening between your normal periods.",

      moderate:
        "Moderate bleeding is useful to consider with its duration and timing. Let’s check whether it is happening between your normal periods.",

      heavy:
        "Heavy bleeding is important to evaluate, particularly if it continues or is accompanied by other symptoms. Let’s check when the bleeding is occurring.",

      very_heavy:
        "Very heavy bleeding can require prompt medical evaluation, especially if you feel weak or dizzy. Let’s check when the bleeding is occurring.",
    },

    between_periods: {
      yes:
        "Bleeding between normal periods is important to note because the timing can help a healthcare professional understand the pattern. Next, I’ll check whether it occurs after sexual activity.",

      no:
        "The bleeding is not occurring between your normal periods based on your answer. Let’s check whether it occurs after sexual activity.",

      not_sure:
        "That’s okay. We’ll keep the timing uncertain. Let’s check whether the bleeding occurs after sexual activity.",
    },

    after_sex: {
      yes:
        "Bleeding after sexual activity is important to mention when evaluating abnormal bleeding. Next, I’ll check whether you have pelvic or abdominal pain.",

      sometimes:
        "Occasional bleeding after sexual activity is useful information to consider. Let’s check whether you also have pelvic or abdominal pain.",

      no:
        "There is no bleeding after sexual activity based on your answer. Let’s check whether you have pelvic or abdominal pain.",

      not_applicable:
        "That’s okay. We can continue without this information. Let’s check whether you have pelvic or abdominal pain.",
    },

    severe_pain: {
      severe:
        "Severe pelvic or abdominal pain together with abnormal bleeding is a warning sign that should be taken seriously. I’ll check for dizziness or weakness next.",

      very_severe:
        "Very severe pain together with abnormal bleeding can require prompt medical evaluation. I’ll check for dizziness, fainting, or weakness next.",

      moderate:
        "Moderate pain is useful to consider alongside the bleeding pattern. Let’s check for dizziness or weakness next.",

      mild:
        "Mild pain provides useful context. Let’s check for dizziness or weakness next.",

      none:
        "There is no pelvic or abdominal pain based on your answer. Let’s check for dizziness or weakness next.",
    },

    dizziness: {
      yes:
        "Significant dizziness, fainting, or weakness with abnormal bleeding can be a warning sign. I’ll keep this in the safety assessment. Finally, let’s check whether pregnancy could be possible.",

      sometimes:
        "Occasional dizziness or weakness is important to consider with abnormal bleeding. I’ll keep this in the safety assessment. Finally, let’s check pregnancy possibility.",

      no:
        "There is no significant dizziness or weakness based on your answer. Finally, let’s check whether pregnancy could be possible.",

      default:
        "This helps complete the safety picture. Finally, let’s check whether pregnancy could be possible.",
    },

    pregnancy_possibility: {
      yes:
        "Possible pregnancy is important to consider when unusual bleeding is present. We’ve now covered the main warning signs in this assessment.",

      not_sure:
        "That’s okay. We’ll keep pregnancy possibility uncertain rather than making an assumption. We’ve now covered the main warning signs.",

      no:
        "Pregnancy is less likely based on your answer. We’ve now covered the main warning signs in this assessment.",

      prefer_not_to_say:
        "That’s completely okay. We can complete the assessment without this information. We’ve now covered the main warning signs.",
    },
  },

  // ======================================================
  // URINARY SYMPTOMS
  // ======================================================

  urinary_symptoms: {
    burning: {
      default:
        "The frequency of burning or pain when urinating helps show how persistent the symptom is. Let’s check whether you’re also urinating more frequently than usual.",
    },

    frequency: {
      default:
        "Changes in urination frequency are useful to consider alongside burning or discomfort. Next, I’ll check whether you’re experiencing urinary urgency.",
    },

    urgency: {
      default:
        "Urinary urgency provides another useful piece of the picture. Next, I’ll check whether you’ve noticed blood in your urine.",
    },

    blood_in_urine: {
      yes:
        "Blood in the urine should be medically evaluated rather than ignored. I’ll also check for fever or chills because they can provide important context.",

      no:
        "There is no blood in the urine based on your answer. Let’s check for fever or chills next.",

      not_sure:
        "That’s okay. We’ll keep this uncertain. Let’s check for fever or chills next.",
    },

    fever: {
      yes:
        "Fever or chills together with urinary symptoms can be a warning sign, especially if there is also significant back or side pain. I’ll check for that next.",

      no:
        "There is no fever or chills based on your answer. Let’s check whether you have significant back or side pain.",

      not_sure:
        "That’s okay. We’ll keep this uncertain. Let’s check whether you have significant back or side pain.",
    },

    back_or_side_pain: {
      yes:
        "Significant back or side pain together with urinary symptoms and fever can require prompt medical evaluation. I’ll keep this in the safety assessment. Finally, let’s check pregnancy possibility.",

      no:
        "There is no significant back or side pain based on your answer. Finally, let’s check whether pregnancy could be possible.",

      not_sure:
        "That’s okay. We’ll keep this uncertain. Finally, let’s check whether pregnancy could be possible.",
    },

    pregnancy_possibility: {
      yes:
        "Possible pregnancy is useful information when evaluating urinary or pelvic symptoms. We’ve now covered the main factors in this assessment.",

      not_sure:
        "That’s okay. We’ll keep pregnancy possibility uncertain. We’ve now covered the main factors in this assessment.",

      no:
        "Pregnancy is less likely based on your answer. We’ve now covered the main factors in this assessment.",

      prefer_not_to_say:
        "That’s completely okay. We can complete the assessment without this information. We’ve now covered the main factors.",
    },
  },

  // ======================================================
  // PREGNANCY CONCERN
  // ======================================================

  pregnancy_concern: {
    pregnancy_possibility: {
      yes:
        "Possible pregnancy is central to this assessment, so I’ll use the remaining answers to understand your situation and identify any warning signs. Let’s continue with your current period status.",

      not_sure:
        "That’s okay. We don’t need to assume either way. I’ll use the remaining questions to understand your situation. Let’s start with your current period status.",

      no:
        "Pregnancy appears less likely based on your answer. If your concern is related to a delayed or unusual period, we can still look at other possible causes. Let’s start with your current period status.",

      default:
        "We can continue without this information and focus on the symptoms you’re comfortable sharing. Let’s look at your current period status.",
    },

    period_status: {
      default:
        "Your current period status helps establish the context for the concern. Next, I’ll check for symptoms that can sometimes occur during early pregnancy or with other menstrual changes.",
    },

    pregnancy_symptoms: {
      default:
        "These symptoms provide useful context, but symptoms alone cannot confirm pregnancy. The remaining questions will help identify whether there are any warning signs.",
    },

    pelvic_pain: {
      severe:
        "Severe pelvic pain when pregnancy is possible is a warning sign that requires prompt medical attention. I’ll check the bleeding next.",

      very_severe:
        "Very severe pelvic pain when pregnancy is possible can require urgent medical evaluation. I’ll check the bleeding next.",

      default:
        "Pelvic pain is important to consider when pregnancy is possible. Let’s check whether there is any unusual bleeding.",
    },

    bleeding: {
      heavy:
        "Heavy bleeding when pregnancy is possible should be medically evaluated. I’ll use this information when determining the overall safety level.",

      very_heavy:
        "Very heavy bleeding when pregnancy is possible can require prompt medical evaluation. I’ll use this as an important safety factor.",

      default:
        "The bleeding pattern helps complete the safety picture. We’ve now covered the main factors in this assessment.",
    },
  },
};

// ======================================================
// GET ANSWER FEEDBACK
// ======================================================

const getAnswerFeedback = (category, questionId, answer) => {
  const feedback =
    ANSWER_FEEDBACK?.[category]?.[questionId];

  if (!feedback) {
    return "Let’s use that information to move to the next part of the assessment.";
  }

  // Multi-choice answers
  if (Array.isArray(answer)) {
    const responses = answer
      .map((value) => feedback[value])
      .filter(Boolean);

    if (responses.length > 0) {
      return responses.join(" ");
    }

    return (
      feedback.default ||
      "Let’s use that information to move to the next part of the assessment."
    );
  }

  return (
    feedback[answer] ||
    feedback.default ||
    "Let’s use that information to move to the next part of the assessment."
  );
};

module.exports = {
  ANSWER_FEEDBACK,
  getAnswerFeedback,
};