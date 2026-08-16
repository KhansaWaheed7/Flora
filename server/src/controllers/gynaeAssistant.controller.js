const {
  generateGynaeResponse,
} = require("../services/gynaeAssistant.service");

const GynaeConversation = require("../models/GynaeConversation");

const {
  GYNAE_CATEGORIES,
  CATEGORY_INFO,
} = require("../data/gynae/categories");

const {
  QUESTION_FLOWS,
} = require("../data/gynae/questions");

const {
  evaluateSafety,
} = require("../data/gynae/safetyRules");

const {
  getAssessmentResult,
} = require("../data/gynae/assessmentResults");


// CHECK IF MESSAGE IS A VALID ANSWER TO CURRENT QUESTION
// 

const isValidQuestionAnswer = (question, message) => {
  if (!question || !message) {
    return false;
  }

  const answer = message.trim();

  // Single choice
  if (question.type === "single_choice") {
    return question.options.some(
      (option) => option.value === answer
    );
  }

  // Multi choice
  if (question.type === "multi_choice") {
    try {
      const selectedValues = JSON.parse(answer);

      if (!Array.isArray(selectedValues)) {
        return false;
      }

      const validValues = question.options.map(
        (option) => option.value
      );

      return (
        selectedValues.length > 0 &&
        selectedValues.every((value) =>
          validValues.includes(value)
        )
      );
    } catch {
      return false;
    }
  }

  return false;
};


// CREATE NEW CONVERSATION

const createConversation = async (req, res, next) => {
  try {
    const conversation = await GynaeConversation.create({
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};



// SEND MESSAGE

const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    let conversation;

    // Existing conversation


    if (conversationId) {
      conversation = await GynaeConversation.findOne({
        _id: conversationId,
        user: req.user._id,
      });

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }
    }

    if (conversation.status === "completed") {
  return res.status(400).json({
    success: false,
    message:
      "This assessment has already been completed. Please start a new conversation for another assessment.",
  });
}


    // Create conversation if none exists

    if (!conversation) {
      conversation = await GynaeConversation.create({
        user: req.user._id,
      });
    }


    // Save user message


    conversation.messages.push({
      role: "user",
      content: message.trim(),
    });


// Handle answer to current assessment qs

if (
  conversation.currentQuestion &&
  conversation.category
) {
  const questionFlow = QUESTION_FLOWS[conversation.category];

  if (questionFlow) {
    const currentQuestion = questionFlow.find(
      (question) =>
        question.id === conversation.currentQuestion
    );

    if (currentQuestion) {
      let answer = message.trim();
      // Only treat the message as an assessment answer
  // if it matches one of the available options.
  const validAnswer = isValidQuestionAnswer(
    currentQuestion,
    answer
  );

  // If it is NOT a valid option, do NOT save it as an
  // assessment answer. Let Gemini handle it as a new query.
  if (!validAnswer) {
    // Remove the user message temporarily because we are
    // going to process it through Gemini below.
    conversation.messages.pop();
  } else {

    // -----------------------------------------------
// Validate structured question answers
// -----------------------------------------------

if (
  ["single_choice", "multi_choice"].includes(
    currentQuestion.type
  )
) {
  let selectedValues;

  if (currentQuestion.type === "single_choice") {
    selectedValues = [answer];
  } else {
    try {
      selectedValues = JSON.parse(answer);

      if (!Array.isArray(selectedValues)) {
        throw new Error("Invalid multi-choice answer");
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Please select one or more valid options.",
        question: currentQuestion.question,
        options: currentQuestion.options,
      });
    }
  }

  const validValues = currentQuestion.options.map(
    (option) => option.value
  );

  const allValid = selectedValues.every((value) =>
    validValues.includes(value)
  );

  if (!allValid) {
    return res.status(400).json({
      success: false,
      message: "Please select a valid option.",
      question: currentQuestion.question,
      options: currentQuestion.options,
    });
  }

  // Prevent selecting "none" together with other symptoms
  if (
    currentQuestion.type === "multi_choice" &&
    selectedValues.includes("none") &&
    selectedValues.length > 1
  ) {
    return res.status(400).json({
      success: false,
      message: "You cannot select 'None' together with other options.",
      question: currentQuestion.question,
      options: currentQuestion.options,
    });
  }

  answer =
    currentQuestion.type === "single_choice"
      ? selectedValues[0]
      : selectedValues;
}

      // Convert yes/no answers to boolean
// Convert yes/no answers to boolean


      // Convert numeric answers to numbers
      

      // Save answer
      conversation.assessment.answers[
  currentQuestion.id
] = answer;

conversation.markModified(
  "assessment.answers"
);

      // -----------------------------------------------
      // Check safety rules
      // -----------------------------------------------

      const safetyResult = evaluateSafety(
        conversation.category,
        conversation.assessment.answers
      );

      conversation.assessment.riskLevel =
        safetyResult.riskLevel;

      conversation.assessment.redFlags =
        safetyResult.redFlags;

      // -----------------------------------------------
      // Find next unanswered question
      // -----------------------------------------------

      const answeredQuestions = Object.keys(
        conversation.assessment.answers
      );

      const nextQuestion = questionFlow.find(
        (question) =>
          !answeredQuestions.includes(question.id)
      );

      if (nextQuestion) {
        conversation.currentQuestion =
          nextQuestion.id;

        conversation.messages.push({
          role: "assistant",
          content: nextQuestion.question,
        });

        await conversation.save();

        return res.status(200).json({
  success: true,
  data: {
    conversationId: conversation._id,
    category: conversation.category,
    riskLevel: conversation.assessment.riskLevel,

    question: {
      id: nextQuestion.id,
      text: nextQuestion.question,
      type: nextQuestion.type,
      options: nextQuestion.options || [],
    },

    response: nextQuestion.question,
  },
});
      }

      // -----------------------------------------------
      // Assessment completed
      // -----------------------------------------------

      conversation.assessment.completed = true;
conversation.currentQuestion = null;
conversation.status = "completed";

const assessmentResult = getAssessmentResult(
  conversation.category,
  conversation.assessment.riskLevel,
  conversation.assessment.redFlags,
  conversation.assessment.answers
);
conversation.assessment.result = {
  title: assessmentResult.title,
  summary: assessmentResult.summary,
  recommendation: assessmentResult.recommendation,
};

conversation.markModified("assessment.result");

await conversation.save();

return res.status(200).json({
  success: true,
  data: {
    conversationId: conversation._id,

    category: conversation.category,

    riskLevel:
      conversation.assessment.riskLevel,

    redFlags:
      conversation.assessment.redFlags,

    completed: true,

    result: {
      title: assessmentResult.title,
      summary: assessmentResult.summary,
      recommendation: assessmentResult.recommendation,
    },

    response:
      "Your assessment is complete. Please remember that this assessment does not provide a medical diagnosis.",
  },
});
    }
  }
}
}

    // -----------------------------------------------
    // Build conversation history
    // -----------------------------------------------

    const conversationHistory = conversation.messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    // -----------------------------------------------
    // Ask Gemini to understand the message
    // -----------------------------------------------

    const prompt = `
You are Flora, a women's gynecological health assistant.

Your role is to provide safe, general, educational information about
women's gynecological and reproductive health.

You are NOT a doctor and must never diagnose a disease or claim that
the user definitely has a condition.

Supported categories:

${Object.entries(CATEGORY_INFO)
  .map(
    ([key, info]) =>
      `${key}: ${info.name} - ${info.description}`
  )
  .join("\n")}

Conversation history:

${conversationHistory}

User's latest message:

${message}

Your tasks:

1. Understand the user's LATEST message.

2. Determine the most appropriate category.

3. Decide whether the user is:
   - asking a general health question,
   - describing a symptom/concern that requires structured assessment,
   - answering the current assessment question,
   - or asking something unrelated to gynecological/reproductive health.
CATEGORY RULES:

- If the user is answering the current structured assessment question,
  keep the existing assessment category.

- If the user describes a new gynecological symptom or concern that
  matches one of the structured assessment categories, select that category.

- If the user asks a general educational question that does NOT require
  collecting symptom information, use:
  "general_menstrual_health"
  or
  "general_gynae"
  as appropriate.

- If the user asks about periods, menstruation, cycle length, delayed
  periods, PMS, or general menstrual health without requesting an
  assessment, use "general_menstrual_health".

  - If the user asks a general gynecological or reproductive-health
  question that does not fit another category, use "general_gynae".

- If the user's message is unrelated to gynecological or reproductive
  health, use "out_of_scope".

IMPORTANT:

Do NOT start a structured assessment merely because the user mentions
a gynecological topic.

For example:

User: "What causes irregular periods?"
→ general_menstrual_health
User: "Why do I have white discharge?"
→ general_gynae

User: "My period is 10 days late."
→ missed_period

User: "I have severe pelvic pain."
→ pelvic_pain

User: "What are common causes of painful periods?"
→ general_menstrual_health

User: "I have very heavy bleeding."
→ abnormal_bleeding

4. Generate a short response to the user's latest message.

GENERAL QUESTIONS:

For general educational questions:
- Explain the topic briefly and clearly.
- Mention common possible causes or factors when appropriate.
- Do not diagnose.
- Do not unnecessarily ask assessment questions.
- Encourage professional medical evaluation if symptoms are persistent,
  severe, worsening, or concerning.

  SYMPTOM DESCRIPTIONS:

If the user describes symptoms that require assessment:
- Keep the response brief.
- Do not diagnose.
- The structured assessment will collect additional information.

SAFETY:

- Never claim certainty about a medical condition.
- Never present the assistant as a doctor.
- Do not prescribe medication or provide personalized treatment plans.
- Do not provide emergency medical treatment instructions.
- If concerning symptoms are described, the backend safety rules will
  separately evaluate them.
  OUT OF SCOPE:

If the message is unrelated to gynecological or reproductive health,
politely state that Flora is designed for women's gynecological and
reproductive health questions.

CONFIDENCE:

confidence must be a number between 0 and 1.

Return ONLY valid JSON in this exact format:

{
  "category": "one_of_the_supported_categories",
  "confidence": 0.0,
  "response": "A short natural response to the user"
}
`;

    const aiResponse = await generateGynaeResponse(prompt);

    // -----------------------------------------------
    // Parse Gemini JSON
    // -----------------------------------------------

    let result;

    try {
      const cleanedResponse = aiResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      result = JSON.parse(cleanedResponse);
    } catch (error) {
      result = {
        category: GYNAE_CATEGORIES.GENERAL_GYNAE,
        confidence: 0,
        response: aiResponse,
      };
    }

    // -----------------------------------------------
    // Validate category
    // -----------------------------------------------

    const validCategories = Object.values(GYNAE_CATEGORIES);

    if (!validCategories.includes(result.category)) {
      result.category = GYNAE_CATEGORIES.GENERAL_GYNAE;
    }

    // -----------------------------------------------
// Update detected category
// -----------------------------------------------

const categoryChanged =
  conversation.category !== result.category;

// If Gemini detected a NEW category,
// start a fresh assessment for that category.
if (categoryChanged) {
  conversation.category = result.category;
  

  conversation.assessment.answers = {};
  conversation.assessment.redFlags = [];
  conversation.assessment.riskLevel = "low";
  conversation.assessment.completed = false;
  conversation.assessment.result = {
    title: null,
    summary: null,
    recommendation: null,
  };
  conversation.currentQuestion = null;
  conversation.status = "active";

  conversation.markModified("assessment.answers");
  conversation.markModified("assessment.redFlags");
  conversation.markModified("assessment.riskLevel");
}


    // -----------------------------------------------
    // Add assistant response
    // -----------------------------------------------

    // -----------------------------------------------
// Start structured assessment
// -----------------------------------------------

let assistantResponse = result.response;

const questionFlow = QUESTION_FLOWS[result.category];

if (
  questionFlow &&
  questionFlow.length > 0 &&
  conversation.assessment.completed === false
) {
  const answeredQuestions = Object.keys(
    conversation.assessment.answers || {}
  );

  const nextQuestion = questionFlow.find(
    (question) => !answeredQuestions.includes(question.id)
  );

  if (nextQuestion) {
    assistantResponse = nextQuestion.question;

    conversation.currentQuestion = nextQuestion.id;
  }
}

// -----------------------------------------------
// Add assistant response
// -----------------------------------------------

conversation.messages.push({
  role: "assistant",
  content: assistantResponse,
});

await conversation.save();

    // -----------------------------------------------
    // Return response
    // -----------------------------------------------

    const currentQuestion = conversation.currentQuestion
  ? QUESTION_FLOWS[conversation.category]?.find(
      (question) =>
        question.id === conversation.currentQuestion
    )
  : null;

res.status(200).json({
  success: true,
  data: {
    conversationId: conversation._id,
    category: conversation.category,
    confidence: result.confidence,

    question: currentQuestion
      ? {
          id: currentQuestion.id,
          text: currentQuestion.question,
          type: currentQuestion.type,
          options: currentQuestion.options || [],
        }
      : null,

    response: assistantResponse,
  },
});
  } catch (error) {
    next(error);
  }
};


// ======================================================
// GET CONVERSATION HISTORY
// ======================================================

const getConversationHistory = async (req, res, next) => {
  try {
    const conversations = await GynaeConversation.find({
      user: req.user._id,
    })
      .sort({ updatedAt: -1 })
      .select(
        "category status messages createdAt updatedAt assessment"
      );

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};


// ======================================================
// GET SINGLE CONVERSATION
// ======================================================

const getConversation = async (req, res, next) => {
  try {
    const conversation = await GynaeConversation.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  createConversation,
  sendMessage,
  getConversationHistory,
  getConversation,
};