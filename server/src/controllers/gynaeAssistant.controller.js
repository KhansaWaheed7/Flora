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
} = require("../data/gynae/assessmentResult");

const {
  getAnswerFeedback,
} = require("../data/gynae/answerFeedback");

const {
  generateAssessmentSummary,
} = require("../data/gynae/assessmentSummary");

// ======================================================
// HELPERS
// ======================================================

const isValidQuestionAnswer = (
  question,
  message
) => {
  if (!question || !message) {
    return false;
  }

  const answer = message.trim();

  // ------------------------------
  // Single choice
  // ------------------------------

  if (question.type === "single_choice") {
    return question.options.some(
      (option) => option.value === answer
    );
  }

  // ------------------------------
  // Multi choice
  // ------------------------------

  if (question.type === "multi_choice") {
    try {
      const selectedValues = JSON.parse(answer);

      if (!Array.isArray(selectedValues)) {
        return false;
      }

      const validValues = question.options.map(
        (option) => option.value
      );

      if (selectedValues.length === 0) {
        return false;
      }

      if (
        selectedValues.some(
          (value) => !validValues.includes(value)
        )
      ) {
        return false;
      }

      // "none" cannot be combined with another option
      if (
        selectedValues.includes("none") &&
        selectedValues.length > 1
      ) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  return false;
};

const normalizeAnswer = (
  question,
  rawAnswer
) => {
  if (question.type === "single_choice") {
    return rawAnswer.trim();
  }

  if (question.type === "multi_choice") {
    const parsed = Array.isArray(rawAnswer)
      ? rawAnswer
      : JSON.parse(rawAnswer);

    return parsed;
  }

  return rawAnswer.trim();
};

const getQuestion = (
  category,
  questionId
) => {
  const flow = QUESTION_FLOWS[category];

  if (!flow || !questionId) {
    return null;
  }

  return (
    flow.find(
      (question) =>
        question.id === questionId
    ) || null
  );
};

const getNextQuestion = (
  category,
  answers
) => {
  const flow = QUESTION_FLOWS[category];

  if (!flow) {
    return null;
  }

  const answeredQuestions = new Set(
    Object.keys(answers || {})
  );

  return (
    flow.find(
      (question) =>
        !answeredQuestions.has(question.id)
    ) || null
  );
};

const resetAssessment = (conversation) => {
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

  conversation.markModified(
    "assessment.answers"
  );

  conversation.markModified(
    "assessment.redFlags"
  );

  conversation.markModified(
    "assessment.result"
  );
};

const getAssessmentQuestionPayload = (
  question
) => {
  if (!question) {
    return null;
  }

  return {
    id: question.id,
    text: question.question,
    type: question.type,
    options: question.options || [],
  };
};

// ======================================================
// CREATE NEW CONVERSATION
// ======================================================

const createConversation = async (
  req,
  res,
  next
) => {
  try {
    const conversation =
      await GynaeConversation.create({
        user: req.user._id,
      });

    res.status(201).json({
      success: true,

      data: {
        conversationId: conversation._id,
        category: null,
        status: conversation.status,
        messages: [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// PROCESS VALID ASSESSMENT ANSWER
// ======================================================

const processAssessmentAnswer = async (
  conversation,
  currentQuestion,
  message
) => {
  const answer = normalizeAnswer(
    currentQuestion,
    message
  );

  // ----------------------------------------------
  // Extra multi-choice validation
  // ----------------------------------------------

  if (
    currentQuestion.type ===
    "multi_choice"
  ) {
    if (
      answer.includes("none") &&
      answer.length > 1
    ) {
      throw new Error(
        "You cannot select 'None' together with other options."
      );
    }
  }

  // ----------------------------------------------
  // Save answer
  // ----------------------------------------------

  conversation.assessment.answers[
    currentQuestion.id
  ] = answer;

  conversation.markModified(
    "assessment.answers"
  );

  // ----------------------------------------------
  // Evaluate safety
  // ----------------------------------------------

  const safetyResult = evaluateSafety(
    conversation.category,
    conversation.assessment.answers
  );

  conversation.assessment.riskLevel =
    safetyResult.riskLevel;

  conversation.assessment.redFlags =
    safetyResult.redFlags;

  conversation.markModified(
    "assessment.redFlags"
  );

  // ----------------------------------------------
  // Find next question
  // ----------------------------------------------

  const nextQuestion = getNextQuestion(
    conversation.category,
    conversation.assessment.answers
  );

  const answerFeedback =
    getAnswerFeedback(
      conversation.category,
      currentQuestion.id,
      answer
    );

  // ----------------------------------------------
  // Continue assessment
  // ----------------------------------------------

  if (nextQuestion) {
    conversation.currentQuestion =
      nextQuestion.id;

    const assistantResponse =
      `${answerFeedback} ${nextQuestion.question}`;

    conversation.messages.push({
      role: "assistant",
      content: assistantResponse,
    });

    await conversation.save();

    return {
      completed: false,
      response: assistantResponse,
      question: getAssessmentQuestionPayload(
        nextQuestion
      ),
    };
  }

  // ----------------------------------------------
  // Assessment completed
  // ----------------------------------------------

  conversation.assessment.completed =
    true;

  conversation.currentQuestion = null;
  conversation.status = "completed";

  const summary =
    generateAssessmentSummary(
      conversation.category,
      conversation.assessment.answers
    );

  const redFlags =
    conversation.assessment.redFlags || [];

  const assessmentResult =
    getAssessmentResult(
      conversation.category,
      conversation.assessment.riskLevel,
      redFlags,
      conversation.assessment.answers
    );

  conversation.assessment.result = {
    title: assessmentResult.title,
    summary: assessmentResult.summary,
    recommendation:
      assessmentResult.recommendation,
  };

  const finalResponse =
    `Thank you for completing the assessment. ` +
    `This assessment does not provide a medical diagnosis.` +

    `\n\n${assessmentResult.title}` +

    `\n\n${assessmentResult.summary}` +

    `\n\nRecommendation:\n${assessmentResult.recommendation}` +

    `\n\nSummary:\n${summary}` +

    (
      redFlags.length > 0
        ? `\n\nRed flags:\n${redFlags
            .map(
              (flag) => `• ${flag}`
            )
            .join("\n")}`
        : `\n\nNo immediate red flags were identified from your answers.`
    );

  conversation.messages.push({
    role: "assistant",
    content: finalResponse,
  });

  await conversation.save();

  return {
    completed: true,
    response: finalResponse,
    question: null,

    assessment: {
      riskLevel:
        conversation.assessment.riskLevel,

      result: {
        title: assessmentResult.title,
        summary: assessmentResult.summary,
        recommendation:
          assessmentResult.recommendation,
      },

      redFlags,

      summary,
    },
  };
};

// ======================================================
// SEND MESSAGE
// ======================================================

const sendMessage = async (
  req,
  res,
  next
) => {
  try {
    const {
      conversationId,
      message,
    } = req.body;

    // ----------------------------------------------
    // Validate message
    // ----------------------------------------------

    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // ----------------------------------------------
    // Get or create conversation
    // ----------------------------------------------

    let conversation;

    if (conversationId) {
      conversation =
        await GynaeConversation.findOne({
          _id: conversationId,
          user: req.user._id,
        });

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }
    } else {
      conversation =
        await GynaeConversation.create({
          user: req.user._id,
        });
    }

    // ----------------------------------------------
    // Completed conversation cannot receive messages
    // ----------------------------------------------

    if (
      conversation.status ===
      "completed"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This assessment has already been completed. Please start a new conversation.",
      });
    }

    const cleanMessage = message.trim();

    // ----------------------------------------------
    // Current assessment question
    // ----------------------------------------------

    const currentQuestion =
      getQuestion(
        conversation.category,
        conversation.currentQuestion
      );

    // ----------------------------------------------
    // If this is a valid structured answer,
    // NEVER send it to Gemini.
    // ----------------------------------------------

    if (
      currentQuestion &&
      isValidQuestionAnswer(
        currentQuestion,
        cleanMessage
      )
    ) {
      conversation.messages.push({
        role: "user",
        content: cleanMessage,
      });

      try {
        const result =
          await processAssessmentAnswer(
            conversation,
            currentQuestion,
            cleanMessage
          );

        return res.status(200).json({
          success: true,

          data: {
            conversationId:
              conversation._id,

            category:
              conversation.category,

            completed:
              result.completed,

            riskLevel:
              conversation.assessment
                .riskLevel,

            question:
              result.question,

            assessment:
              result.assessment || null,

            response:
              result.response,
          },
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message:
            error.message ||
            "Invalid assessment answer.",
        });
      }
    }

    // ----------------------------------------------
    // Save user message
    // ----------------------------------------------

    conversation.messages.push({
      role: "user",
      content: cleanMessage,
    });

    // ----------------------------------------------
    // Build Gemini history
    // ----------------------------------------------

    const conversationHistory =
      conversation.messages
        .map(
          (msg) =>
            `${msg.role}: ${msg.content}`
        )
        .join("\n");

    // ----------------------------------------------
    // Gemini classification prompt
    // ----------------------------------------------

    const prompt = `
You are Flora, a women's gynecological health assistant.

Your role is to provide safe, general, educational information about
women's gynecological and reproductive health.

You are NOT a doctor and must never diagnose a disease or claim that
the user definitely has a condition.

SUPPORTED CATEGORIES:

${Object.entries(CATEGORY_INFO)
  .map(
    ([key, info]) =>
      `${key}: ${info.name} - ${info.description}`
  )
  .join("\n")}

CURRENT ASSESSMENT STATE:

Category:
${conversation.category || "none"}

Current question:
${
  currentQuestion
    ? currentQuestion.question
    : "none"
}

IMPORTANT ASSESSMENT RULE:

If there is a current assessment question and the user's message
does NOT match one of its structured options, DO NOT change the
assessment category.

The message may be:
- a clarification,
- a general question,
- an additional symptom,
- or unrelated text.

In that situation, answer the user's message briefly but preserve
the current assessment.

CATEGORY RULES:

1. General educational questions should NOT automatically start
   an assessment.

2. Periods, menstruation, cycle length, delayed periods, PMS,
   or general menstrual questions without symptom assessment
   should use:
   "general_menstrual_health"

3. General gynecological or reproductive questions should use:
   "general_gynae"

4. Possible pregnancy concerns should use:
   "pregnancy_concern"

5. If the user clearly describes a symptom that corresponds to
   a structured assessment category, select that category.

Examples:

"What causes irregular periods?"
=> general_menstrual_health

"Why do I have white discharge?"
=> general_gynae

"My period is 10 days late."
=> missed_period

"I have severe pelvic pain."
=> pelvic_pain

"What are common causes of painful periods?"
=> general_menstrual_health

"I have very heavy bleeding."
=> abnormal_bleeding

"I think I might be pregnant."
=> pregnancy_concern

6. If the message is unrelated to gynecological or reproductive
health, use:
"out_of_scope"

RESPONSE RULES:

- Understand the user's LATEST message.
- Give a short natural response.
- Do not diagnose.
- Do not prescribe medication.
- Do not provide personalized treatment plans.
- Do not claim certainty.
- If symptoms sound concerning, recommend professional evaluation.
- Do not unnecessarily ask assessment questions.
- The backend handles structured assessments and safety rules.

Conversation history:

${conversationHistory}

User's latest message:

${cleanMessage}

Return ONLY valid JSON:

{
  "category": "one_of_the_supported_categories",
  "confidence": 0.0,
  "response": "A short natural response"
}
`;

    // ----------------------------------------------
    // Gemini
    // ----------------------------------------------

    const aiResponse =
      await generateGynaeResponse(
        prompt
      );

    // ----------------------------------------------
    // Parse JSON
    // ----------------------------------------------

    let result;

    try {
      const cleanedResponse =
        String(aiResponse)
          .replace(
            /```json/gi,
            ""
          )
          .replace(
            /```/g,
            ""
          )
          .trim();

      result =
        JSON.parse(cleanedResponse);
    } catch {
      result = {
        category:
          GYNAE_CATEGORIES.GENERAL_GYNAE,

        confidence: 0,

        response:
          aiResponse ||
          "I'm sorry, I couldn't process that response.",
      };
    }

    // ----------------------------------------------
    // Validate category
    // ----------------------------------------------

    const validCategories =
      Object.values(
        GYNAE_CATEGORIES
      );

    if (
      !validCategories.includes(
        result.category
      )
    ) {
      result.category =
        GYNAE_CATEGORIES.GENERAL_GYNAE;
    }

    // ----------------------------------------------
    // IMPORTANT:
    // Preserve active assessment.
    //
    // Gemini must NOT switch an assessment
    // just because the user sent free text.
    // ----------------------------------------------

    if (currentQuestion) {
      const assistantResponse =
        result.response ||
        "Let's continue with your current assessment.";

      conversation.messages.push({
        role: "assistant",
        content: assistantResponse,
      });

      // Keep existing category/question.

      await conversation.save();

      return res.status(200).json({
        success: true,

        data: {
          conversationId:
            conversation._id,

          category:
            conversation.category,

          confidence:
            result.confidence,

          question:
            getAssessmentQuestionPayload(
              currentQuestion
            ),

          response:
            assistantResponse,
        },
      });
    }

    // ----------------------------------------------
    // No active assessment
    // ----------------------------------------------

    const detectedCategory =
      result.category;

    const categoryChanged =
      conversation.category !==
      detectedCategory;

    if (categoryChanged) {
      conversation.category =
        detectedCategory;

      resetAssessment(
        conversation
      );
    }

    // ----------------------------------------------
    // Start structured assessment
    // ONLY if this category has a question flow.
    // ----------------------------------------------

    const questionFlow =
      QUESTION_FLOWS[
        conversation.category
      ];

    let assistantResponse =
      result.response;

    let nextQuestion = null;

    if (
      questionFlow &&
      questionFlow.length > 0
    ) {
      nextQuestion =
        getNextQuestion(
          conversation.category,
          conversation.assessment
            .answers
        );

      if (nextQuestion) {
        conversation.currentQuestion =
          nextQuestion.id;

        assistantResponse =
          `${result.response} ${nextQuestion.question}`;
      }
    }

    // ----------------------------------------------
    // Save assistant response
    // ----------------------------------------------

    conversation.messages.push({
      role: "assistant",
      content: assistantResponse,
    });

    await conversation.save();

    // ----------------------------------------------
    // Response
    // ----------------------------------------------

    return res.status(200).json({
      success: true,

      data: {
        conversationId:
          conversation._id,

        category:
          conversation.category,

        confidence:
          result.confidence,

        question:
          getAssessmentQuestionPayload(
            nextQuestion
          ),

        response:
          assistantResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// GET CONVERSATION HISTORY
// ======================================================

const getConversationHistory = async (
  req,
  res,
  next
) => {
  try {
    const conversations =
      await GynaeConversation.find({
        user: req.user._id,
      })
        .sort({
          updatedAt: -1,
        })
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

const getConversation = async (
  req,
  res,
  next
) => {
  try {
    const conversation =
      await GynaeConversation.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message:
          "Conversation not found",
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